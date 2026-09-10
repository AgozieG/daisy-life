import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

const DRINKS = [
  'Zobo',
  'Milkshake (Vanilla)',
  'Milkshake (Strawberry)',
  'Milkshake (Chocolate)',
  'Chivita Exotic (Pineapple & Coconut) (Big)',
];

const DRINK_PRICE = {
  'Zobo': 1800,
  'Milkshake (Vanilla)': 4000,
  'Milkshake (Strawberry)': 4200,
  'Milkshake (Chocolate)': 4500,
  'Chivita Exotic (Pineapple & Coconut) (Big)': 2500,
};

const BOX_DRINKS = [
  { name: 'Zobo', price: 1800 },
  { name: 'Milkshake (Vanilla)', price: 4000 },
  { name: 'Milkshake (Strawberry)', price: 4200 },
  { name: 'Milkshake (Chocolate)', price: 4500 },
  { name: 'Chivita Exotic (Pineapple & Coconut) (Big)', price: 2500 },
];

const BREAKFAST_DRINKS = [
  { name: 'Tea', price: 1500 },
  { name: 'Coffee', price: 1500 },
  { name: 'Fresh Juice', price: 2500 },
  { name: 'Milkshake', price: 2500 },
  { name: 'Water', price: 500 },
];

export default function ProductModal({ product, category, onClose, editingItem = null }) {
  const { addItem, updateItem } = useCart();
  const { showToast } = useToast();

  const [variant, setVariant] = useState(editingItem?.selectedVariant || product?.variants?.[0]?.name || null);
  const [flavours, setFlavours] = useState(editingItem?.selectedFlavours || []);
  const [extras, setExtras] = useState(() => normalizeExtras(editingItem?.selectedToppings || []));
  const [drinks, setDrinks] = useState(() => normalizeDrinks(editingItem?.selectedDrink));
  const [notes, setNotes] = useState(editingItem?.specialInstructions || '');
  const [qty, setQty] = useState(editingItem?.quantity || 1);

  const drinkOptions = category.id === 'box-of-happiness'
    ? BOX_DRINKS
    : category.id === 'breakfast-box' ? BREAKFAST_DRINKS : DRINKS.map((name) => ({ name, price: DRINK_PRICE[name] || 0 }));

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
  const extrasTotal = extras.reduce((sum, e) => sum + (e.price * Math.max(1, Number(e.quantity || 1))), 0);
  const drinkPrice = drinks.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const unitPrice = product.basePrice + variantModifier + extrasTotal + drinkPrice;
  const total = unitPrice * qty;

  const addExtra = (extra) => {
    setExtras((prev) => {
      const existing = prev.find((e) => e.id === extra.id);
      if (existing) {
        return prev.map((e) => (e.id === extra.id ? { ...e, quantity: (Number(e.quantity || 1) + 1) } : e));
      }
      return [...prev, { ...extra, quantity: 1 }];
    });
  };

  const removeExtra = (extra) => {
    setExtras((prev) => {
      const existing = prev.find((e) => e.id === extra.id);
      if (!existing) return prev;
      if ((Number(existing.quantity || 1) - 1) <= 0) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return prev.map((e) => (e.id === extra.id ? { ...e, quantity: Number(e.quantity || 1) - 1 } : e));
    });
  };

  const toggleFlavour = (flavour) => {
    setFlavours((prev) => (prev.includes(flavour) ? prev.filter((f) => f !== flavour) : [...prev, flavour]));
  };

  const updateDrinkQuantity = (drinkOption, delta) => {
    setDrinks((prev) => {
      const existing = prev.find((item) => item.name === drinkOption.name);
      const nextQuantity = Math.max(0, (existing?.quantity || 0) + delta);
      if (nextQuantity === 0) return prev.filter((item) => item.name !== drinkOption.name);
      if (existing) return prev.map((item) => (item.name === drinkOption.name ? { ...item, quantity: nextQuantity } : item));
      return [...prev, { ...drinkOption, quantity: nextQuantity }];
    });
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
      selectedDrink: drinks.map((item) => `${item.name}${item.quantity > 1 ? ` × ${item.quantity}` : ''}`).join(', '),
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
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.7 }, colors: ['#E34B36', '#B9322B', '#F47A32', '#4D9A70'] });
      showToast(`${product.name} added to cart`, 'success');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm flex items-end sm:items-center justify-center"
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
            <h2 className="font-display text-2xl font-bold text-charcoal mb-1">{product.name}</h2>
            <p className="text-charcoal/60 text-sm font-body mb-5">{product.description}</p>

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
                  {product.availableExtras.map((extra) => {
                    const current = extras.find((e) => e.id === extra.id);
                    const quantity = Number(current?.quantity || 0);
                    return (
                      <div
                        key={extra.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-charcoal text-sm font-body">{extra.name}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => removeExtra(extra)}
                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                            aria-label={`Remove ${extra.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-5 text-center text-charcoal text-sm font-body font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => addExtra(extra)}
                            className="w-7 h-7 rounded-full bg-daisy-gold flex items-center justify-center text-charcoal hover:bg-daisy-gold/90"
                            aria-label={`Add ${extra.name}`}
                          >
                            <Plus size={12} />
                          </button>
                          <span className="text-daisy-gold text-sm font-accent font-semibold ml-2">+{formatCurrency(extra.price)}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {product.hasDrinkOption && (
              <Section title="🥤 Pick a Drink" optional>
                <div className="space-y-2">
                  {drinkOptions.map((drinkOption) => {
                    const selected = drinks.find((item) => item.name === drinkOption.name);
                    const quantity = selected?.quantity || 0;
                    return (
                      <div key={drinkOption.name} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                        <span className="text-charcoal text-sm font-body">{drinkOption.name}</span>
                        <span className="flex items-center gap-2">
                          <button type="button" onClick={() => updateDrinkQuantity(drinkOption, -1)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white" aria-label={`Remove ${drinkOption.name}`}><Minus size={12} /></button>
                          <span className="min-w-5 text-center text-charcoal text-sm font-body font-bold">{quantity}</span>
                          <button type="button" onClick={() => updateDrinkQuantity(drinkOption, 1)} className="w-7 h-7 rounded-full bg-daisy-gold flex items-center justify-center text-charcoal" aria-label={`Add ${drinkOption.name}`}><Plus size={12} /></button>
                          <span className="text-daisy-gold text-xs font-accent">+{formatCurrency(drinkOption.price)}</span>
                        </span>
                      </div>
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-charcoal text-sm font-body placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-daisy-gold resize-none"
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

function normalizeExtras(items = []) {
  return items
    .map((item) => ({
      ...item,
      id: item.id || item.name,
      quantity: Math.max(1, Number(item.quantity || 1)),
    }))
    .filter((item) => item.name || item.id);
}

function normalizeDrinks(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item && item.name).map((item) => ({ ...item, quantity: Math.max(1, Number(item.quantity || 1)) }));
  }
  if (typeof value === 'string' && value.trim()) {
    return [{ name: value, price: DRINK_PRICE[value] || 0, quantity: 1 }];
  }
  return [];
}

function Section({ title, children, optional, required }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-accent font-semibold text-white text-sm uppercase tracking-wide">{title}</h4>
        {optional && <span className="text-[10px] text-charcoal/50 font-body">(Optional)</span>}
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
