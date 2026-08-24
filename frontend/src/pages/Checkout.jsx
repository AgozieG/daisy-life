import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Truck, Store, Lock } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatCurrency';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const STEPS = ['Review', 'Delivery', 'Pay'];

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      showToast('Sign in to start checking out', 'info');
      navigate('/auth');
    } else if (cartItems.length === 0) {
      navigate('/menu');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grandTotal = subtotal;

  const canContinueDelivery = phone.trim().length >= 7 && (deliveryType === 'pickup' || address.trim().length >= 5);

  const loadPaystackScript = () =>
    new Promise((resolve, reject) => {
      if (window.PaystackPop) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

  const handlePaystackCallback = async (reference) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders/verify-and-dispatch`, {
        reference,
        cartItems,
        deliveryDetails: { phone, address, deliveryNote },
        userProfile: user,
        deliveryType,
        grandTotal,
      });
      if (res.data.success) {
        clearCart();
        navigate('/order-success', { state: { orderId: reference, deliveryType, phone, address } });
      } else {
        showToast(res.data.message || 'Order could not be confirmed', 'error');
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Payment verification failed. Please contact us on WhatsApp with your reference.';

      showToast(message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
      showToast('Paystack is not configured yet. Add VITE_PAYSTACK_PUBLIC_KEY to .env', 'warning');
      return;
    }
    try {
      await loadPaystackScript();
    } catch {
      showToast('Could not load payment gateway. Check your connection.', 'error');
      return;
    }
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: Math.round(grandTotal * 100),
      currency: 'NGN',
      ref: `DL-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: user.name },
          { display_name: 'Phone', variable_name: 'phone', value: phone },
        ],
      },
      callback: (response) => handlePaystackCallback(response.reference),
      onClose: () => showToast('Payment cancelled', 'info'),
    });
    handler.openIframe();
  };

  if (!user || cartItems.length === 0) return null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-bold text-white mb-6">Checkout</h1>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-accent font-bold ${i <= step ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/50'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm font-body hidden sm:inline ${i <= step ? 'text-white' : 'text-white/40'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-daisy-gold' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-charcoal-light rounded-xl p-4 flex gap-3">
                    <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-white font-body font-semibold text-sm">{item.productName} × {item.quantity}</h4>
                        <span className="text-daisy-gold font-accent font-bold text-sm">{formatCurrency(item.lineTotal)}</span>
                      </div>
                      {item.selectedVariant && <p className="text-white/50 text-xs mt-1">Size: {item.selectedVariant}</p>}
                      {item.selectedFlavours?.length > 0 && <p className="text-white/50 text-xs">Flavour: {item.selectedFlavours.join(', ')}</p>}
                      {item.selectedToppings?.length > 0 && <p className="text-white/50 text-xs">Extras: {item.selectedToppings.map((t) => t.name).join(', ')}</p>}
                      {item.selectedDrink && <p className="text-white/50 text-xs">Drink: {item.selectedDrink}</p>}
                    </div>
                  </div>
                ))}
                <button onClick={() => setStep(1)} className="w-full bg-daisy-gold text-charcoal font-accent font-bold py-3.5 rounded-full mt-4">
                  Confirm & Continue →
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex bg-white/5 rounded-full p-1">
                  {[{ id: 'pickup', label: 'Pickup', icon: Store }, { id: 'delivery', label: 'Delivery', icon: Truck }].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDeliveryType(opt.id)}
                      className={`flex-1 py-2.5 rounded-full text-sm font-accent font-semibold flex items-center justify-center gap-2 transition-colors ${
                        deliveryType === opt.id ? 'bg-daisy-gold text-charcoal' : 'text-white/60'
                      }`}
                    >
                      <opt.icon size={15} /> {opt.label}
                    </button>
                  ))}
                </div>

                {deliveryType === 'pickup' ? (
                  <div className="bg-forest-green/15 border border-forest-green/40 rounded-xl p-4 text-sm font-body text-white/80">
                    📍 Pick up at Sabbath Bus Stop, 7 Umueke St, New Haven, Enugu<br />
                    ⏱️ Estimated ready time: ~15–20 minutes after order
                  </div>
                ) : (
                  <>
                    <Field label="Delivery Address" value={address} onChange={setAddress} placeholder="Street, landmark, LGA" textarea />
                    <p className="text-white/40 text-xs -mt-3 font-body">Our rider will confirm the delivery fee before dispatch</p>
                    <Field label="Delivery Note (Optional)" value={deliveryNote} onChange={setDeliveryNote} placeholder="e.g. Gate is green, next to the pharmacy" />
                  </>
                )}

                <Field label="Phone Number" value={phone} onChange={setPhone} placeholder="Your rider or the kitchen will call this number" type="tel" />

                <button
                  disabled={!canContinueDelivery}
                  onClick={() => setStep(2)}
                  className="w-full bg-daisy-gold disabled:opacity-40 text-charcoal font-accent font-bold py-3.5 rounded-full"
                >
                  Continue to Payment →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="bg-charcoal-light rounded-2xl p-5">
                  <h3 className="font-accent font-bold text-white mb-3">Final Order Summary</h3>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm font-body text-white/70 py-1">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-3 pt-3 flex justify-between text-sm font-body text-white/70">
                    <span>Delivery</span><span>{deliveryType === 'pickup' ? 'Free (Pickup)' : 'Rider-confirmed'}</span>
                  </div>
                  <div className="flex justify-between font-accent font-bold text-daisy-gold text-xl mt-2">
                    <span>Total</span><span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full bg-daisy-gold disabled:opacity-60 text-charcoal font-accent font-bold py-4 rounded-full flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> {isProcessing ? 'Confirming order…' : `Pay ${formatCurrency(grandTotal)} Now`}
                </button>
                <p className="text-white/40 text-xs text-center font-body">Payment secured by Paystack</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 bg-charcoal-light rounded-2xl p-5 border border-white/5">
            <h3 className="font-accent font-bold text-white mb-3">Order Total</h3>
            <div className="flex justify-between text-sm text-white/70 font-body mb-2">
              <span>{cartItems.length} items</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-accent font-bold text-daisy-gold">
              <span>Total</span><span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[95] bg-charcoal/95 backdrop-blur flex flex-col items-center justify-center">
          <span className="text-6xl animate-pulse-glow rounded-full">🌼</span>
          <p className="text-white font-body mt-4">Confirming your order…</p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', textarea }) {
  return (
    <div>
      <label className="block text-white/70 text-sm font-body mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-daisy-gold resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-daisy-gold"
        />
      )}
    </div>
  );
}
