import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check } from 'lucide-react';
import menuData from '../data/menu.json';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

const ELIGIBLE = ['pizza', 'loaded-fries', 'small-chops'];

const BASES = {
  pizza: [
    { id: 'classic', name: 'Classic Crust', price: 0 },
    { id: 'thin', name: 'Thin Crust', price: 0 },
    { id: 'stuffed', name: 'Stuffed Crust', price: 2000 },
  ],
  'loaded-fries': [
    { id: 'regular', name: 'Regular Fries', price: 0 },
    { id: 'waffle', name: 'Waffle Fries', price: 500 },
    { id: 'sweet-potato', name: 'Sweet Potato Fries', price: 800 },
  ],
  'small-chops': [
    { id: 'solo', name: 'Solo Box', price: 4500 },
    { id: 'duo', name: 'Duo Box', price: 6500 },
    { id: 'celebration', name: 'Celebration Box', price: 11500 },
  ],
};

export default function CreateYourPlate() {
  const [catId, setCatId] = useState('pizza');
  const [step, setStep] = useState(0);
  const [base, setBase] = useState(BASES.pizza[0]);
  const [proteins, setProteins] = useState([]);
  const [flavour, setFlavour] = useState(null);
  const [drink, setDrink] = useState(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const category = menuData.categories.find((c) => c.id === catId);
  const availableExtras = category?.products.find((p) => p.hasExtras)?.availableExtras || [];
  const availableFlavours = category?.products.find((p) => p.hasFlavours)?.availableFlavours || [];
  const drinkOptions = [
    { name: 'Milkshake', price: 4000 },
    { name: 'Zobo', price: 1800 },
    { name: 'Soft Drink', price: 800 },
  ];

  const steps = ['Base', 'Protein & Toppings', 'Flavour', 'Drink', 'Review'];

  const switchCategory = (id) => {
    setCatId(id);
    setBase(BASES[id][0]);
    setProteins([]);
    setFlavour(null);
    setDrink(null);
    setStep(0);
  };

  const toggleProtein = (extra) => {
    setProteins((prev) => (prev.some((p) => p.id === extra.id) ? prev.filter((p) => p.id !== extra.id) : [...prev, extra]));
  };

  const total = useMemo(() => {
    const proteinsTotal = proteins.reduce((s, p) => s + p.price, 0);
    const drinkPrice = drink ? drink.price : 0;
    return base.price + proteinsTotal + drinkPrice;
  }, [base, proteins, drink]);

  const handleAdd = () => {
    const label = `Custom ${category.name.replace(/s$/, '')} — ${base.name}`;
    addItem({
      productId: `custom-${catId}-${Date.now()}`,
      productName: label,
      category: category.name,
      image: category.products[0]?.image,
      basePrice: base.price,
      selectedVariant: base.name,
      selectedFlavours: flavour ? [flavour] : [],
      selectedToppings: proteins,
      selectedDrink: drink?.name || null,
      specialInstructions: '',
      quantity: 1,
      unitPrice: total,
      lineTotal: total,
    });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#F5C518', '#C0392B', '#1A7A4A'] });
    showToast(`${label} added to cart!`, 'success');
    switchCategory(catId);
  };

  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-3xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">🍽️ Create Your Plate</h1>
      <p className="text-white/60 font-body mb-6">Build your own Pizza, Loaded Fries, or Small Chops box.</p>

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
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {step === 0 && (
            <StepBlock title="Choose Your Base">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BASES[catId].map((b) => (
                  <OptionCard key={b.id} active={base.id === b.id} onClick={() => setBase(b)} title={b.name} price={b.price} />
                ))}
              </div>
            </StepBlock>
          )}

          {step === 1 && (
            <StepBlock title="Protein & Toppings (Optional)">
              <div className="space-y-2">
                {availableExtras.map((extra) => (
                  <label key={extra.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                    <span className="flex items-center gap-3">
                      <input type="checkbox" checked={proteins.some((p) => p.id === extra.id)} onChange={() => toggleProtein(extra)} className="w-4 h-4 accent-daisy-gold" />
                      <span className="text-white text-sm font-body">{extra.name}</span>
                    </span>
                    <span className="text-daisy-gold text-sm font-accent font-semibold">+{formatCurrency(extra.price)}</span>
                  </label>
                ))}
              </div>
            </StepBlock>
          )}

          {step === 2 && (
            <StepBlock title="Flavour (Optional)">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFlavour(null)} className={`px-4 py-2 rounded-full text-sm font-body ${!flavour ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/70'}`}>None</button>
                {(availableFlavours.length ? availableFlavours : ['Original', 'Spicy', 'BBQ']).map((f) => (
                  <button key={f} onClick={() => setFlavour(f)} className={`px-4 py-2 rounded-full text-sm font-body ${flavour === f ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/70'}`}>{f}</button>
                ))}
              </div>
            </StepBlock>
          )}

          {step === 3 && (
            <StepBlock title="🥤 Pick a Drink">
              <div className="space-y-3">
                <button onClick={() => setDrink(null)} className={`px-4 py-2 rounded-full text-sm font-body ${!drink ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/70'}`}>None</button>
                {drinkOptions.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setDrink(d)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-body ${drink?.name === d.name ? 'bg-daisy-gold text-charcoal' : 'bg-white/10 text-white/70'}`}
                  >
                    <span>{d.name}</span>
                    <span className="font-accent font-semibold">{formatCurrency(d.price)}</span>
                  </button>
                ))}
              </div>
            </StepBlock>
          )}

          {step === 4 && (
            <StepBlock title="Review Your Plate">
              <div className="bg-white/5 rounded-2xl p-5 space-y-2 font-body text-sm text-white/80">
                <p><span className="text-white/50">Base:</span> {base.name}</p>
                {proteins.length > 0 && <p><span className="text-white/50">Toppings:</span> {proteins.map((p) => p.name).join(', ')}</p>}
                {flavour && <p><span className="text-white/50">Flavour:</span> {flavour}</p>}
                {drink && <p><span className="text-white/50">Drink:</span> {drink.name} - {formatCurrency(drink.price)}</p>}
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-accent font-bold text-daisy-gold text-lg">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
            </StepBlock>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-charcoal border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="px-5 py-3 rounded-full bg-white/10 text-white font-accent font-semibold text-sm">
              Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep((s) => s + 1)} className="flex-1 bg-daisy-gold text-charcoal font-accent font-bold py-3 rounded-full">
              Continue · {formatCurrency(total)}
            </button>
          ) : (
            <button onClick={handleAdd} className="flex-1 bg-deep-red text-white font-accent font-bold py-3 rounded-full flex items-center justify-center gap-2">
              <Check size={16} /> Add Custom Plate to Cart
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
