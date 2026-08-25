import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

export default function ProductModal({ product, category, onClose, editingItem = null }) {
  const { addItem, updateItem } = useCart();
  const { showToast } = useToast();

  const [variant, setVariant] = useState(editingItem?.selectedVariant || product?.variants?.[0]?.name || null);
  const [flavours, setFlavours] = useState(editingItem?.selectedFlavours || []);
  const [extras, setExtras] = useState(editingItem?.selectedToppings || []);
  const [drink, setDrink] = useState(editingItem?.selectedDrink || null);
  const [notes, setNotes] = useState(editingItem?.specialInstructions || '');
  const [qty, setQty] = useState(editingItem?.quantity || 1);

  const getDrinkPrice = (name) => {
    const value = String(name || '').trim().toLowerCase();
    if (value === 'milkshake') return 4000;
    if (value === 'zobo') return 1800;
    if (value === 'soft drink' || value === 'softdrink') return 800;
    return 0;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  const variantModifier = variant
    ? product.variants.find((v) => v.name === variant)?.priceModifier || 0
    : 0;
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const drinkPrice = drink ? getDrinkPrice(drink) : 0;
  const unitPrice = product.basePrice + variantModifier + extrasTotal + drinkPrice;
  const total = unitPrice * qty;

  const toggleExtra = (extra) => {
    setExtras((prev) =>
      prev.some((e) => e.id === extra.id) ? prev.filter((e) => e.id !== extra.id) : [...prev, extra]
    );
  };

  const toggleFlavour = (flavour) => {
    setFlavours((prev) => (prev.includes(flavour) ? prev.filter((f) => f !== flavour) : [...prev, flavour]));
  };

  const handleSubmit = () => {
    const payload = {
      id: editingItem?.id,
      productId: product.id,
      productName: product.name,
      category: category.name,
      image: product.image,
      basePrice: product.basePrice,
      selectedVariant: variant,
      selectedFlavours: flavours,
      selectedToppings: extras,
      selectedDrink: drink,
      specialInstructions: notes.trim(),
      quantity: qty,
      unitPrice,
      lineTotal: total,
    };

    if (editingItem) {
      updateItem(editingItem.id, payload);
      showToast(`${product.name} updated in cart`, 'success');
    } else {
      addItem(payload);
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.7 }, colors: ['#F5C518', '#C0392B', '#FF6B35'] });
      showToast(`${product.name} added to cart`, 'success');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-charcoal w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto no-scrollbar border border-white/10 shadow-2xl"
        >
          <div className="relative h-56">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal/80 backdrop-blur flex items-center justify-center hover:bg-charcoal"
              aria-label="Close"
            >
              <X size={18} className="text-white" />
            </button>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal to-transparent" />
          </div>

          <div className="p-5 sm:p-6">
            <h2 className="font-display text-2xl font-bold text-white mb-1">{product.name}</h2>
            <p className="text-white/60 text-sm font-body mb-5">{product.description}</p>

            {product.hasVariants && product.variants.length > 0 && (
              <Section title="Size / Type" required>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <Pill key={v.name} active={variant === v.name} onClick={() => setVariant(v.name)}>
                      {v.name} {v.priceModifier > 0 ? `+${formatCurrency(v.priceModifier)}` : ''}
                    </Pill>
                  ))}
                </div>
              </Section>
            )}

            {product.hasFlavours && product.availableFlavours.length > 0 && (
              <Section title="Flavours" optional>
                <div className="flex flex-wrap gap-2">
                  {product.availableFlavours.map((f) => (
                    <Pill key={f} active={flavours.includes(f)} onClick={() => toggleFlavour(f)}>
                      {f}
                    </Pill>
                  ))}
                </div>
              </Section>
            )}

            {product.hasExtras && product.availableExtras.length > 0 && (
              <Section title="Extra Toppings" optional>
                <div className="space-y-2">
                  {product.availableExtras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={extras.some((e) => e.id === extra.id)}
                          onChange={() => toggleExtra(extra)}
                          className="w-4 h-4 accent-daisy-gold"
                        />
                        <span className="text-white text-sm font-body">{extra.name}</span>
                      </span>
                      <span className="text-daisy-gold text-sm font-accent font-semibold">+{formatCurrency(extra.price)}</span>
                    </label>
                  ))}
                </div>
              </Section>
            )}

            {product.hasDrinkOption && product.availableDrinks.length > 0 && (
              <Section title="🥤 Pick a Drink" optional>
                <div className="space-y-2">
                  <Pill active={drink === null} onClick={() => setDrink(null)}>None</Pill>
                  {product.availableDrinks.map((d) => {
                    const price = getDrinkPrice(d);
                    return (
                      <Pill key={d} active={drink === d} onClick={() => setDrink(d)}>
                        {d} {price > 0 ? `- ${formatCurrency(price)}` : ''}
                      </Pill>
                    );
                  })}
                </div>
              </Section>
            )}

            <Section title="Quantity">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-accent font-bold text-white text-lg w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 rounded-full bg-daisy-gold flex items-center justify-center text-charcoal active:scale-90 transition-transform"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </Section>

            <Section title="Special Instructions" optional>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests for the kitchen?"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-daisy-gold resize-none"
              />
            </Section>
          </div>

          <div className="sticky bottom-0 bg-charcoal border-t border-white/10 p-4 sm:p-5">
            <button
              onClick={handleSubmit}
              disabled={product.hasVariants && !variant}
              className="w-full bg-daisy-gold disabled:opacity-40 disabled:cursor-not-allowed text-charcoal font-accent font-bold py-3.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {editingItem ? 'Update Cart' : 'Add to Cart'} · {formatCurrency(total)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ title, children, optional, required }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-accent font-semibold text-white text-sm uppercase tracking-wide">{title}</h4>
        {optional && <span className="text-[10px] text-white/40 font-body">(Optional)</span>}
        {required && <span className="text-[10px] text-hot-orange font-body">(Required)</span>}
      </div>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm font-body font-medium transition-all active:scale-95 ${
        active ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/80 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  );
}
