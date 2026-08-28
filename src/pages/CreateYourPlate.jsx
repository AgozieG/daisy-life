import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Minus, Plus } from 'lucide-react';
import menuData from '../data/menu.json';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

const ELIGIBLE = ['loaded-fries', 'small-chops'];

const LOADED_FRIES_SIZES = [
  { id: 'smaller', name: 'Smaller (500ml)', price: 500 },
  { id: 'regular', name: 'Regular (1000ml)', price: 600 },
];

const LOADED_FRIES_BASES = [
  { id: 'french-fries', name: 'French Fries', singlePrice: 2500, doublePrice: 4000 },
  { id: 'sweet-potato', name: 'Sweet Potato', singlePrice: 2000, doublePrice: 3500 },
];

const LOADED_FRIES_PROTEINS = [
  { id: 'chicken', name: 'Chicken', price: 2500 },
  { id: 'beef', name: 'Beef', price: 2000 },
  { id: 'sausage', name: 'Sausage', price: 800 },
  { id: 'cheese', name: 'Cheese', price: 1500 },
  { id: 'cream', name: 'Cream', price: 0 },
  { id: 'ketchup', name: 'Ketchup', price: 0 },
];

const SMALL_CHOPS_PACKS = [
  { id: 'regular', name: 'Regular', price: 500 },
  { id: 'large', name: 'Large', price: 700 },
];

const SMALL_CHOPS_CONTENT = [
  { id: 'samosa', name: 'Samosa', price: 600 },
  { id: 'spring-roll', name: 'Spring Roll', price: 500 },
  { id: 'money-bag', name: 'Money Bag', price: 800 },
  { id: 'puff-puff', name: 'Puff Puff (10)', price: 1500 },
  { id: 'prawn-roll', name: 'Prawn Roll (Mayo)', price: 3500 },
  { id: 'pepper-sauce', name: 'Pepper Sauce', price: 1000 },
];

const SMALL_CHOPS_PROTEINS = [
  { id: 'mini-turkey', name: 'Mini Turkey', price: 3500 },
  { id: 'cut-chicken', name: 'Cut Chicken', price: 2500 },
  { id: 'peppered-gizzard', name: 'Peppered Gizzard', price: 1000 },
  { id: 'peppered-beef', name: 'Peppered Beef', price: 800 },
  { id: 'chicken-kebab', name: 'Chicken Kebab', price: 3500 },
  { id: 'beef-kebab', name: 'Beef Kebab', price: 3500 },
];

const DRINK_OPTIONS = [
  { name: 'Zobo', price: 1800 },
  { name: 'Milkshake (Vanilla)', price: 4000 },
  { name: 'Milkshake (Strawberry)', price: 4200 },
  { name: 'Milkshake (Chocolate)', price: 4500 },
  { name: 'Milkshake (Small)', price: 2500 },
  { name: 'Hollandia Strawberry (Big)', price: 2500 },
  { name: 'Hollandia Plain (Big)', price: 2500 },
  { name: 'Chivita Active Zest (Big)', price: 2500 },
  { name: 'Chivita Exotic (Pineapple & Coconut) (Big)', price: 2500 },
  { name: 'Chivita Active (Blue) (Big)', price: 2500 },
  { name: 'V-Smart (Big)', price: 2500 },
  { name: 'Chivita (Medium)', price: 1500 },
  { name: 'Chivita (Small)', price: 1000 },
  { name: 'Hollandia (Medium)', price: 1500 },
  { name: 'Hollandia (Small)', price: 1000 },
  { name: 'Fayrouz', price: 1000 },
  { name: 'Malt', price: 1200 },
  { name: 'Mini Velet Wine', price: 4500 },
  { name: 'Mini Ceres Wine', price: 4500 },
  { name: 'Water', price: 500 },
];

function getDrinkSummary(drinks) {
  return drinks
    .filter((drink) => drink && drink.quantity > 0)
    .map((drink) => `${drink.name}${drink.quantity > 1 ? ` × ${drink.quantity}` : ''}`)
    .join(', ');
}

export default function CreateYourPlate() {
  const [catId, setCatId] = useState('loaded-fries');
  const [step, setStep] = useState(0);
  const [size, setSize] = useState(null);
  const [base, setBase] = useState(null);
  const [pack, setPack] = useState(null);
  const [contents, setContents] = useState([]);
  const [proteins, setProteins] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const category = menuData.categories.find((c) => c.id === catId);
  const steps = catId === 'loaded-fries'
    ? ['Size', 'Base', 'Protein & Toppings', 'Drinks']
    : ['Pack', 'Content', 'Protein', 'Drinks'];

  const activeBase = LOADED_FRIES_BASES.find((item) => item.id === base) || null;
  const basePrice = size && activeBase ? (size.id === 'smaller' ? activeBase.singlePrice : activeBase.doublePrice) : 0;
  const loadedFriesPrice = (size ? size.price : 0) + basePrice;

  const smallChopsContentTotal = contents.reduce((sum, item) => sum + item.price, 0);
  const proteinTotal = proteins.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const drinkTotal = drinks.reduce((sum, drink) => sum + drink.price * drink.quantity, 0);
  const selectedProteinCount = proteins.reduce((sum, item) => sum + item.quantity, 0);

  const total = useMemo(() => {
    if (catId === 'loaded-fries') return loadedFriesPrice + proteinTotal + drinkTotal;
    if (!pack) return 0;
    return pack.price + smallChopsContentTotal + proteinTotal + drinkTotal;
  }, [catId, loadedFriesPrice, pack, smallChopsContentTotal, proteinTotal, drinkTotal]);

  const clearSelectionsForStep = (targetStep) => {
    if (targetStep === 0) setSize(null);
    if (targetStep === 1) setBase(null);
    if (targetStep === 2) setProteins([]);
    if (targetStep === 3) setDrinks([]);
  };

  const switchCategory = (id) => {
    setCatId(id);
    setStep(0);
    setSize(null);
    setBase(null);
    setPack(null);
    setContents([]);
    setProteins([]);
    setDrinks([]);
    setMultiplier(1);
  };

  const updateDrinkQuantity = (drinkName, delta) => {
    setDrinks((prev) => {
      const existing = prev.find((item) => item.name === drinkName);
      if (!existing) {
        const drink = DRINK_OPTIONS.find((item) => item.name === drinkName);
        if (!drink) return prev;
        return [...prev, { ...drink, quantity: Math.max(1, delta) }];
      }
      const nextQuantity = Math.max(0, existing.quantity + delta);
      if (nextQuantity === 0) return prev.filter((item) => item.name !== drinkName);
      return prev.map((item) => (item.name === drinkName ? { ...item, quantity: nextQuantity } : item));
    });
  };

  const updateProteinQuantity = (item, delta) => {
    setProteins((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      const currentQuantity = existing ? existing.quantity : 0;
      const nextQuantity = Math.max(0, currentQuantity + delta);
      if (nextQuantity === 0) return prev.filter((entry) => entry.id !== item.id);
      if (existing) {
        return prev.map((entry) => (entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry));
      }
      return [...prev, { ...item, quantity: nextQuantity }];
    });
  };

  const updateContentQuantity = (item, delta) => {
    setContents((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      const currentQuantity = existing ? existing.quantity : 0;
      const nextQuantity = Math.max(0, currentQuantity + delta);
      if (nextQuantity === 0) return prev.filter((entry) => entry.id !== item.id);
      if (existing) {
        return prev.map((entry) => (entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry));
      }
      return [...prev, { ...item, quantity: nextQuantity }];
    });
  };

  const toggleFreeProtein = (item) => {
    setProteins((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) return prev.filter((entry) => entry.id !== item.id);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const requiredProteinCount = catId === 'loaded-fries' && size && size.id === 'regular' ? 2 : 1;
  const canContinue = (() => {
    if (catId === 'loaded-fries') {
      if (step === 0) return !!size;
      if (step === 1) return !!base;
      if (step === 2) return selectedProteinCount >= requiredProteinCount;
      return true;
    }

    if (step === 0) return !!pack;
    if (step === 1) return contents.length > 0;
    if (step === 2) return selectedProteinCount > 0;
    return true;
  })();

  const handleAdd = () => {
    if (!category) return;
    const customLabel = catId === 'loaded-fries' ? `Custom Loaded Fries — ${size?.name || 'Custom'} · ${activeBase?.name || 'Base'}` : `Custom Small Chops — ${pack?.name || 'Pack'}`;
    const extras = catId === 'loaded-fries'
      ? proteins.filter((item) => item.quantity > 0)
      : [...contents, ...proteins.filter((item) => item.quantity > 0)];
    const finalDrinkText = getDrinkSummary(drinks) || 'No drink';
    const safeTotal = total * multiplier;

    addItem({
      productId: `custom-${catId}-${Date.now()}`,
      productName: customLabel,
      category: category.name,
      image: category.products[0]?.image,
      basePrice: catId === 'loaded-fries' ? loadedFriesPrice : (pack ? pack.price + smallChopsContentTotal : 0),
      selectedVariant: catId === 'loaded-fries' ? `${size?.name || 'Custom'} · ${activeBase?.name || 'Base'}` : `${pack?.name || 'Custom'} pack`,
      selectedFlavours: [],
      selectedToppings: extras,
      selectedDrink: finalDrinkText,
      specialInstructions: '',
      quantity: multiplier,
      unitPrice: total,
      lineTotal: safeTotal,
    });

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#F5C518', '#C0392B', '#1A7A4A'] });
    showToast(`${customLabel} added to cart!`, 'success');
    switchCategory(catId);
  };


  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-3xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">🍽️ Create Your Plate</h1>
      <p className="text-white/60 font-body mb-6">Build your own Loaded Fries or Small Chops box step by step.</p>

      <div className="flex gap-2 mb-8">
        {ELIGIBLE.map((id) => {
          const c = menuData.categories.find((cat) => cat.id === id);
          return (
            <button
              key={id}
              onClick={() => switchCategory(id)}
              className={`flex-1 py-3 rounded-xl font-accent font-semibold text-sm transition-all ${
                catId === id ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {c.emoji} {c.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-daisy-gold' : 'bg-white/10'}`} />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${catId}-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {catId === 'loaded-fries' && step === 0 && (
            <StepBlock title="Choose a Size">
              <div className="grid grid-cols-1 gap-3">
                {LOADED_FRIES_SIZES.map((option) => (
                  <OptionCard
                    key={option.id}
                    active={size?.id === option.id}
                    onClick={() => {
                      setSize(option);
                      setBase(null);
                      setProteins([]);
                      setDrinks([]);
                      setStep(1);
                    }}
                    title={option.name}
                    price={option.price}
                  />
                ))}
              </div>
            </StepBlock>
          )}

          {catId === 'loaded-fries' && step === 1 && (
            <StepBlock title="Choose Your Base">
              <div className="space-y-3">
                {LOADED_FRIES_BASES.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setBase(option.id);
                      setProteins([]);
                      setDrinks([]);
                      setStep(2);
                    }}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      base === option.id ? 'bg-daisy-gold/15 border-daisy-gold' : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-body font-semibold text-white text-sm">{option.name}</p>
                        <p className="text-white/50 text-xs mt-1">
                          {size?.id === 'regular' ? 'Double Portion for 1000ml' : '1 Portion for 500ml'}
                        </p>
                      </div>
                      <span className="text-daisy-gold text-xs font-accent font-semibold">
                        {`+${formatCurrency(size?.id === 'regular' ? option.doublePrice : option.singlePrice)}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </StepBlock>
          )}

          {catId === 'loaded-fries' && step === 2 && (
            <StepBlock title={`Choose Your Protein & Toppings${size?.id === 'regular' ? ' (Pick 2 proteins)' : ''}`}>
              <div className="space-y-2">
                {LOADED_FRIES_PROTEINS.map((extra) => {
                  const selected = proteins.find((item) => item.id === extra.id);
                  const quantity = selected ? selected.quantity : 0;
                  const priceValue = extra.price > 0 ? extra.price * quantity : 0;

                  return (
                    <div key={extra.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <div className="flex items-center gap-3">
                        {extra.price > 0 ? (
                          <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                            <button
                              type="button"
                              onClick={() => updateProteinQuantity(extra, -1)}
                              className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
                              aria-label={`Decrease ${extra.name}`}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateProteinQuantity(extra, 1)}
                              className="w-7 h-7 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center"
                              aria-label={`Increase ${extra.name}`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={quantity > 0}
                            onChange={() => toggleFreeProtein(extra)}
                            className="w-4 h-4 accent-daisy-gold"
                          />
                        )}
                        <span className="text-white text-sm font-body">{extra.name}</span>
                      </div>
                      <span className="text-daisy-gold text-sm font-accent font-semibold">
                        {extra.price > 0 ? `+${formatCurrency(extra.price)}${quantity > 0 ? ` × ${quantity} = ${formatCurrency(priceValue)}` : ''}` : (quantity > 0 ? 'Selected' : 'Free')}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-white/60 font-body">
                Selected {selectedProteinCount} / {requiredProteinCount} protein{requiredProteinCount > 1 ? 's' : ''}
              </p>
            </StepBlock>
          )}

          {catId === 'small-chops' && step === 0 && (
            <StepBlock title="Choose a Pack">
              <div className="grid grid-cols-1 gap-3">
                {SMALL_CHOPS_PACKS.map((option) => (
                  <OptionCard
                    key={option.id}
                    active={pack?.id === option.id}
                    onClick={() => {
                      setPack(option);
                      setContents([]);
                      setProteins([]);
                      setDrinks([]);
                      setStep(1);
                    }}
                    title={option.name}
                    price={option.price}
                  />
                ))}
              </div>
            </StepBlock>
          )}

          {catId === 'small-chops' && step === 1 && (
            <StepBlock title="Choose Your Content">
              <div className="space-y-2">
                {SMALL_CHOPS_CONTENT.map((item) => {
                  const selected = contents.find((entry) => entry.id === item.id);
                  const quantity = selected ? selected.quantity : 0;
                  const totalForItem = item.price * quantity;

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                          <button
                            type="button"
                            onClick={() => updateContentQuantity(item, -1)}
                            className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateContentQuantity(item, 1)}
                            className="w-7 h-7 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center"
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-white text-sm font-body">{item.name}</span>
                      </div>
                      <span className="text-daisy-gold text-sm font-accent font-semibold">
                        +{formatCurrency(item.price)}{quantity > 0 ? ` × ${quantity} = ${formatCurrency(totalForItem)}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </StepBlock>
          )}

          {catId === 'small-chops' && step === 2 && (
            <StepBlock title="Choose Your Protein">
              <div className="space-y-2">
                {SMALL_CHOPS_PROTEINS.map((item) => {
                  const selected = proteins.find((entry) => entry.id === item.id);
                  const quantity = selected ? selected.quantity : 0;
                  const totalForItem = item.price * quantity;

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                          <button
                            type="button"
                            onClick={() => updateProteinQuantity(item, -1)}
                            className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateProteinQuantity(item, 1)}
                            className="w-7 h-7 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center"
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-white text-sm font-body">{item.name}</span>
                      </div>
                      <span className="text-daisy-gold text-sm font-accent font-semibold">
                        +{formatCurrency(item.price)}{quantity > 0 ? ` × ${quantity} = ${formatCurrency(totalForItem)}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </StepBlock>
          )}

          {step === steps.length - 1 && (
            <StepBlock title="🥤 Select Drinks">
              <div className="mb-4 rounded-xl border border-daisy-gold/40 bg-daisy-gold/10 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/70 font-body">Current total</span>
                  <span className="font-accent font-bold text-daisy-gold">{formatCurrency(total * multiplier)}</span>
                </div>
                <div className="mt-2 text-xs text-white/70 font-body">{getDrinkSummary(drinks) || 'No drink selected yet'}</div>
              </div>

              <div className="space-y-3">
                {DRINK_OPTIONS.map((drink) => {
                  const selected = drinks.find((item) => item.name === drink.name);
                  const quantity = selected ? selected.quantity : 0;
                  return (
                    <div key={drink.name} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <div className="flex-1">
                        <p className="text-white text-sm font-body">{drink.name}</p>
                        <p className="text-daisy-gold text-xs font-accent">{formatCurrency(drink.price)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateDrinkQuantity(drink.name, -1)}
                          className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
                          aria-label={`Decrease ${drink.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateDrinkQuantity(drink.name, 1)}
                          className="w-8 h-8 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center"
                          aria-label={`Increase ${drink.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </StepBlock>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-charcoal border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => {
                clearSelectionsForStep(step - 1);
                setStep((s) => s - 1);
              }}
              className="px-5 py-3 rounded-full bg-white/10 text-white font-accent font-semibold text-sm"
            >
              Back
            </button>
          )}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setMultiplier((current) => Math.max(1, current - 1))}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-12 text-center text-white font-accent font-bold text-sm">{multiplier}x</span>
            <button
              type="button"
              onClick={() => setMultiplier((current) => current + 1)}
              className="w-8 h-8 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          {step < steps.length - 1 ? (
            <button
              onClick={() => canContinue && setStep((s) => s + 1)}
              disabled={!canContinue}
              className="flex-1 bg-daisy-gold disabled:opacity-40 disabled:cursor-not-allowed text-charcoal font-accent font-bold py-3 rounded-full"
            >
              Continue · {formatCurrency(total * multiplier)}
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="flex-1 bg-deep-red text-white font-accent font-bold py-3 rounded-full flex items-center justify-center gap-2"
            >
              <Check size={16} /> Add Custom Plate to Cart · {formatCurrency(total * multiplier)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepBlock({ title, children }) {
  return (
    <div>
      <h3 className="font-accent font-bold text-white text-lg mb-4">{title}</h3>
      {children}
    </div>
  );
}

function OptionCard({ active, onClick, title, price }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all ${
        active ? 'bg-daisy-gold/15 border-daisy-gold' : 'bg-white/5 border-white/10 hover:border-white/30'
      }`}
    >
      <p className="font-body font-semibold text-white text-sm">{title}</p>
      <p className="text-daisy-gold text-xs font-accent mt-1">{price > 0 ? `+${formatCurrency(price)}` : 'Included'}</p>
    </button>
  );
}
