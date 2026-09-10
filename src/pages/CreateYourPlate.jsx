import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Minus, Plus } from 'lucide-react';
import menuData from '../data/menu.json';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

const ELIGIBLE = ['loaded-fries', 'small-chops', 'pizza', 'hotdog', 'breakfast-box'];

const NO_SELECTION = { id: 'none', name: 'None', price: 0 };

const HOTDOG_OPTIONS = [
  { id: 'beef-loaded-hotdog', name: 'Beef Loaded Hotdog', price: 4500 },
  { id: 'chicken-loaded-hotdog', name: 'Chicken Loaded Hotdog', price: 4500 },
  { id: 'half-half-protein', name: 'Half & Half Protein', price: 5000 },
];

const HOTDOG_SIDES = [
  { id: 'chips', name: 'Chips', price: 2500 },
  { id: 'sweet-potato', name: 'Sweet Potato', price: 2000 },
  { id: 'wings', name: '4 Crunchy Wings', price: 4000 },
];

const HOTDOG_COMBOS = [
  { id: 'chips-drink', name: 'Chips + Soft Drink', price: 3500 },
  { id: 'chips-chicken-drink', name: 'Chips + Chicken + Free Soft Drink', price: 5500 },
];

const PIZZA_SIZES = [
  {
    id: 'medium',
    name: 'Medium',
    price: 2000,
    stuffedCrustPrice: 2000,
    toppings: [
      { id: 'shredded-chicken', name: 'Shredded Chicken', price: 3000 },
      { id: 'shredded-beef', name: 'Shredded Beef', price: 2500 },
      { id: 'pepperoni', name: 'Pepperoni', price: 3000 },
      { id: 'cheese', name: 'Cheese', price: 2500 },
      { id: 'sausage', name: 'Sausage', price: 800 },
      { id: 'green-pepper', name: 'Green Pepper', price: 200 },
      { id: 'sweet-corn', name: 'Sweet Corn', price: 200 },
      { id: 'onions', name: 'Onions', price: 200 },
      { id: 'fresh-tomato', name: 'Fresh Tomato', price: 200 },
    ],
    specials: [
      { id: 'suya-beef', name: 'Suya Beef', price: 3000 },
      { id: 'suya-chicken', name: 'Suya Chicken', price: 3500 },
    ],
  },
  {
    id: 'large',
    name: 'Large',
    price: 3000,
    stuffedCrustPrice: 3000,
    toppings: [
      { id: 'shredded-chicken', name: 'Shredded Chicken', price: 5000 },
      { id: 'shredded-beef', name: 'Shredded Beef', price: 4500 },
      { id: 'pepperoni', name: 'Pepperoni', price: 4500 },
      { id: 'cheese', name: 'Cheese', price: 3500 },
      { id: 'sausage', name: 'Sausage', price: 800 },
      { id: 'green-pepper', name: 'Green Pepper', price: 350 },
      { id: 'sweet-corn', name: 'Sweet Corn', price: 350 },
      { id: 'onions', name: 'Onions', price: 200 },
      { id: 'fresh-tomato', name: 'Fresh Tomato', price: 200 },
    ],
    specials: [
      { id: 'suya-beef', name: 'Suya Beef', price: 5000 },
      { id: 'suya-chicken', name: 'Suya Chicken', price: 5500 },
      { id: 'triple-protein', name: 'Triple Protein', price: 5500 },
    ],
  },
  {
    id: 'extra-large',
    name: 'Extra Large',
    price: 3500,
    stuffedCrustPrice: 3500,
    toppings: [
      { id: 'shredded-chicken', name: 'Shredded Chicken', price: 6000 },
      { id: 'shredded-beef', name: 'Shredded Beef', price: 5000 },
      { id: 'pepperoni', name: 'Pepperoni', price: 5000 },
      { id: 'cheese', name: 'Cheese', price: 4000 },
      { id: 'sausage', name: 'Sausage', price: 800 },
      { id: 'green-pepper', name: 'Green Pepper', price: 400 },
      { id: 'sweet-corn', name: 'Sweet Corn', price: 400 },
      { id: 'onions', name: 'Onions', price: 400 },
      { id: 'fresh-tomato', name: 'Fresh Tomato', price: 200 },
    ],
    specials: [
      { id: 'suya-beef', name: 'Suya Beef', price: 5500 },
      { id: 'suya-chicken', name: 'Suya Chicken', price: 6000 },
      { id: 'triple-protein', name: 'Triple Protein', price: 6000 },
    ],
  },
];

const PIZZA_BASES = [
  { id: 'classic-crust', name: 'Classic Crust', price: 0 },
  { id: 'thin-crust', name: 'Thin Crust', price: 0 },
  { id: 'sausage-stuffed-crust', name: 'Sausage Stuffed Crust', price: 2000 },
];

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
  { name: 'Chivita Exotic (Pineapple & Coconut) (Big)', price: 2500 },
];

const BREAKFAST_ITEMS = [
  { id: 'waffle', name: 'Waffle (4)', price: 4500 },
  { id: 'pancake', name: 'Pancake (4)', price: 4000 },
  { id: 'scrambled-egg', name: 'Scrambled Egg', price: 2500 },
  { id: 'fried-egg', name: 'Fried Egg', price: 2000 },
  { id: 'baked-beans-big', name: 'Baked Beans (Big)', price: 1500 },
  { id: 'baked-beans-small', name: 'Baked Beans (Small)', price: 1000 },
  { id: 'sausage', name: 'Sausage', price: 700 },
  { id: 'sandwich', name: 'Sandwich', price: 4500 },
  { id: 'toast', name: 'Toast', price: 2000 },
  { id: 'chips', name: 'Chips', price: 2500 },
  { id: 'crunchy-wings', name: 'Crunchy Wings (4)', price: 4000 },
  { id: 'apple', name: 'Apple', price: 700 },
  { id: 'syrup', name: 'Syrup', price: 500 },
];

const BREAKFAST_DRINKS = [
  { name: 'Tea', price: 1500 },
  { name: 'Coffee', price: 1500 },
  { name: 'Fresh Juice', price: 2500 },
  { name: 'Milkshake', price: 2500 },
  { name: 'Water', price: 500 },
];

function getDrinkSummary(drinks) {
  return drinks
    .filter((drink) => drink && drink.quantity > 0)
    .map((drink) => `${drink.name}${drink.quantity > 1 ? ` × ${drink.quantity}` : ''}`)
    .join(', ');
}

export default function CreateYourPlate() {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const [catId, setCatId] = useState(ELIGIBLE.includes(requestedCategory) ? requestedCategory : 'loaded-fries');
  const [step, setStep] = useState(0);
  const [size, setSize] = useState(null);
  const [base, setBase] = useState(null);
  const [pack, setPack] = useState(null);
  const [contents, setContents] = useState([]);
  const [proteins, setProteins] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [hotdogChoice, setHotdogChoice] = useState(null);
  const [hotdogSides, setHotdogSides] = useState([]);
  const [hotdogCombos, setHotdogCombos] = useState([]);
  const [pizzaSize, setPizzaSize] = useState(null);
  const [pizzaBase, setPizzaBase] = useState(null);
  const [pizzaToppings, setPizzaToppings] = useState([]);
  const [pizzaSpecials, setPizzaSpecials] = useState([]);
  const [breakfastItems, setBreakfastItems] = useState([]);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const category = menuData.categories.find((c) => c.id === catId) || {
    id: catId,
    name: catId === 'hotdog' ? 'Hotdog' : catId === 'pizza' ? 'Pizza' : 'Custom Plate',
    emoji: catId === 'hotdog' ? '🌭' : catId === 'pizza' ? '🍕' : '🍽️',
    products: [],
  };
  const steps = catId === 'loaded-fries'
    ? ['Size', 'Base', 'Protein & Toppings', 'Drinks']
    : catId === 'small-chops'
      ? ['Pack', 'Content', 'Protein', 'Drinks']
      : catId === 'hotdog'
        ? ['Hotdog', 'Pick a Side', 'Make It a Combo', 'Select Drinks']
        : catId === 'breakfast-box'
          ? ['Choose Items', 'Select Drinks']
        : ['Size', 'Base', 'Protein & Toppings', 'Special Protein Options', 'Select Drinks'];

  const activeBase = LOADED_FRIES_BASES.find((item) => item.id === base) || null;
  const activePizzaSize = PIZZA_SIZES.find((item) => item.id === pizzaSize) || null;
  const activePizzaBase = PIZZA_BASES.find((item) => item.id === pizzaBase) || null;
  const basePrice = size && activeBase ? (size.id === 'smaller' ? activeBase.singlePrice : activeBase.doublePrice) : 0;
  const loadedFriesPrice = (size ? size.price : 0) + basePrice;
  const hotdogSideTotal = hotdogSides.reduce((sum, item) => sum + item.price, 0);
  const hotdogComboTotal = hotdogCombos.reduce((sum, item) => sum + item.price, 0);
  const hotdogPrice = (hotdogChoice ? hotdogChoice.price : 0) + hotdogSideTotal + hotdogComboTotal;
  const pizzaBasePrice = activePizzaBase && activePizzaSize && activePizzaBase.id === 'sausage-stuffed-crust' ? activePizzaSize.stuffedCrustPrice : 0;
  const pizzaToppingTotal = pizzaToppings.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pizzaSpecialTotal = pizzaSpecials.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const smallChopsContentTotal = contents.reduce((sum, item) => sum + item.price, 0);
  const proteinTotal = proteins.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const drinkTotal = drinks.reduce((sum, drink) => sum + drink.price * drink.quantity, 0);
  const breakfastItemsTotal = breakfastItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedProteinCount = proteins.reduce((sum, item) => sum + item.quantity, 0);

  const total = useMemo(() => {
    if (catId === 'loaded-fries') return loadedFriesPrice + proteinTotal + drinkTotal;
    if (catId === 'small-chops') {
      if (!pack) return 0;
      return pack.price + smallChopsContentTotal + proteinTotal + drinkTotal;
    }
    if (catId === 'hotdog') return hotdogPrice + drinkTotal;
    if (catId === 'breakfast-box') return breakfastItemsTotal + drinkTotal;
    if (!pizzaSize) return 0;
    return (activePizzaSize ? activePizzaSize.price : 0) + pizzaBasePrice + pizzaToppingTotal + pizzaSpecialTotal + drinkTotal;
  }, [catId, loadedFriesPrice, pack, smallChopsContentTotal, proteinTotal, drinkTotal, hotdogPrice, breakfastItemsTotal, pizzaSize, activePizzaSize, pizzaBasePrice, pizzaToppingTotal, pizzaSpecialTotal]);

  const clearSelectionsForStep = (targetStep) => {
    if (targetStep === 0) {
      setSize(null);
      setPizzaSize(null);
      setHotdogChoice(null);
    }
    if (targetStep === 1) {
      setBase(null);
      setPizzaBase(null);
      setHotdogSides([]);
    }
    if (targetStep === 2) {
      setProteins([]);
      setPizzaToppings([]);
      setHotdogCombos([]);
    }
    if (targetStep === 3) {
      setDrinks([]);
      setPizzaSpecials([]);
      setBreakfastItems([]);
    }
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
    setHotdogChoice(null);
    setHotdogSides([]);
    setHotdogCombos([]);
    setPizzaSize(null);
    setPizzaBase(null);
    setPizzaToppings([]);
    setPizzaSpecials([]);
    setBreakfastItems([]);
    setMultiplier(1);
  };

  const updateDrinkQuantity = (drinkName, delta) => {
    setDrinks((prev) => {
      const existing = prev.find((item) => item.name === drinkName);
      if (!existing) {
        const drinkList = catId === 'breakfast-box' ? BREAKFAST_DRINKS : DRINK_OPTIONS;
        const drink = drinkList.find((item) => item.name === drinkName);
        if (!drink) return prev;
        return [...prev, { ...drink, quantity: Math.max(1, delta) }];
      }
      const nextQuantity = Math.max(0, existing.quantity + delta);
      if (nextQuantity === 0) return prev.filter((item) => item.name !== drinkName);
      return prev.map((item) => (item.name === drinkName ? { ...item, quantity: nextQuantity } : item));
    });
  };

  const updateBreakfastItemQuantity = (item, delta) => {
    setBreakfastItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      const nextQuantity = Math.max(0, (existing?.quantity || 0) + delta);
      if (nextQuantity === 0) return prev.filter((entry) => entry.id !== item.id);
      if (existing) return prev.map((entry) => (entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry));
      return [...prev, { ...item, quantity: nextQuantity }];
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

  const updatePizzaToppingQuantity = (item, delta) => {
    setPizzaToppings((prev) => {
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

  const updatePizzaSpecialQuantity = (item, delta) => {
    setPizzaSpecials((prev) => {
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

    if (catId === 'small-chops') {
      if (step === 0) return !!pack;
      if (step === 1) return contents.length > 0;
      if (step === 2) return selectedProteinCount > 0;
      return true;
    }

    if (catId === 'hotdog') {
      if (step === 0) return !!hotdogChoice;
      return true;
    }

    if (catId === 'breakfast-box') return step === 0 ? breakfastItems.length > 0 : true;

    if (catId === 'pizza') {
      if (step === 0) return !!pizzaSize;
      if (step === 1) return !!pizzaBase;
      return true;
    }

    return true;
  })();

  const handleAdd = () => {
    if (!category) return;

    let customLabel = '';
    let extras = [];
    let selectedVariant = '';
    let basePriceForCart = 0;

    if (catId === 'loaded-fries') {
      customLabel = `Custom Loaded Fries — ${size?.name || 'Custom'} · ${activeBase?.name || 'Base'}`;
      extras = proteins.filter((item) => item.quantity > 0);
      basePriceForCart = loadedFriesPrice;
      selectedVariant = `${size?.name || 'Custom'} · ${activeBase?.name || 'Base'}`;
    } else if (catId === 'small-chops') {
      customLabel = `Custom Small Chops — ${pack?.name || 'Pack'}`;
      extras = [...contents, ...proteins.filter((item) => item.quantity > 0)];
      basePriceForCart = pack ? pack.price + smallChopsContentTotal : 0;
      selectedVariant = `${pack?.name || 'Custom'} pack`;
    } else if (catId === 'hotdog') {
      customLabel = `Custom Hotdog — ${hotdogChoice?.name || 'Hotdog'}`;
      extras = [...hotdogSides, ...hotdogCombos];
      basePriceForCart = hotdogPrice;
      selectedVariant = `${hotdogChoice?.name || 'Hotdog'} · ${hotdogSides.length ? hotdogSides.map((item) => item.name).join(', ') : 'No side'} · ${hotdogCombos.length ? hotdogCombos.map((item) => item.name).join(', ') : 'No combo'}`;
    } else if (catId === 'breakfast-box') {
      customLabel = 'Create Your Breakfast Plate';
      extras = breakfastItems;
      basePriceForCart = breakfastItemsTotal;
      selectedVariant = breakfastItems.map((item) => `${item.name} × ${item.quantity}`).join(', ');
    } else {
      customLabel = `Custom Pizza — ${activePizzaSize?.name || 'Pizza'}`;
      extras = [...pizzaToppings.filter((item) => item.quantity > 0), ...pizzaSpecials.filter((item) => item.quantity > 0)];
      basePriceForCart = (activePizzaSize ? activePizzaSize.price : 0) + pizzaBasePrice + pizzaToppingTotal + pizzaSpecialTotal;
      selectedVariant = `${activePizzaSize?.name || 'Custom'} · ${activePizzaBase?.name || 'Base'}`;
    }

    const finalDrinkText = getDrinkSummary(drinks) || 'No drink';
    const safeTotal = total * multiplier;

    addItem({
      productId: `custom-${catId}-${Date.now()}`,
      productName: customLabel,
      category: category.name,
      image: category.products[0]?.image,
      basePrice: basePriceForCart,
      selectedVariant,
      selectedFlavours: [],
      selectedToppings: extras,
      selectedDrink: finalDrinkText,
      specialInstructions: '',
      quantity: multiplier,
      unitPrice: total,
      lineTotal: safeTotal,
    });

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#E34B36', '#B9322B', '#4D9A70', '#F47A32'] });
    showToast(`${customLabel} added to cart!`, 'success');
    switchCategory(catId);
  };


  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-3xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">🍽️ Create Your Plate</h1>
      <p className="text-white/60 font-body mb-6">Build your own hotdog, pizza, loaded fries, or small chops box step by step.</p>

      <div className="flex gap-2 mb-8">
        {ELIGIBLE.map((id) => {
          const c = menuData.categories.find((cat) => cat.id === id) || {
            id,
            name: id === 'hotdog' ? 'Hotdog' : id === 'pizza' ? 'Pizza' : id === 'breakfast-box' ? 'Breakfast Box' : 'Custom Plate',
            emoji: id === 'hotdog' ? '🌭' : id === 'pizza' ? '🍕' : id === 'breakfast-box' ? '🍳' : '🍽️',
          };
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

          {catId === 'hotdog' && step === 0 && (
            <StepBlock title="Choose Your Hotdog">
              <div className="grid grid-cols-1 gap-3">
                {HOTDOG_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.id}
                    active={hotdogChoice?.id === option.id}
                    onClick={() => {
                      setHotdogChoice(option);
                      setHotdogSides([]);
                      setHotdogCombos([]);
                      setStep(1);
                    }}
                    title={option.name}
                    price={option.price}
                  />
                ))}
              </div>
            </StepBlock>
          )}

          {catId === 'hotdog' && step === 1 && (
            <StepBlock title="Pick a Side (Choose as many as you want)">
              <div className="grid grid-cols-1 gap-3">
                {HOTDOG_SIDES.map((option) => {
                  const active = hotdogSides.some((item) => item.id === option.id);
                  return (
                    <OptionCard
                      key={option.id}
                      active={active}
                      onClick={() => {
                        setHotdogSides((prev) => {
                          const exists = prev.some((item) => item.id === option.id);
                          return exists ? prev.filter((item) => item.id !== option.id) : [...prev, option];
                        });
                      }}
                      title={option.name}
                      price={option.price}
                    />
                  );
                })}
              </div>
            </StepBlock>
          )}

          {catId === 'hotdog' && step === 2 && (
            <StepBlock title="Make It a Combo (Choose as many as you want)">
              <div className="grid grid-cols-1 gap-3">
                {HOTDOG_COMBOS.map((option) => {
                  const active = hotdogCombos.some((item) => item.id === option.id);
                  return (
                    <OptionCard
                      key={option.id}
                      active={active}
                      onClick={() => {
                        setHotdogCombos((prev) => {
                          const exists = prev.some((item) => item.id === option.id);
                          return exists ? prev.filter((item) => item.id !== option.id) : [...prev, option];
                        });
                      }}
                      title={option.name}
                      price={option.price}
                    />
                  );
                })}
              </div>
            </StepBlock>
          )}

          {catId === 'pizza' && step === 0 && (
            <StepBlock title="Choose Your Size">
              <div className="grid grid-cols-1 gap-3">
                {PIZZA_SIZES.map((option) => (
                  <OptionCard
                    key={option.id}
                    active={pizzaSize === option.id}
                    onClick={() => {
                      setPizzaSize(option.id);
                      setPizzaBase(null);
                      setPizzaToppings([]);
                      setPizzaSpecials([]);
                      setStep(1);
                    }}
                    title={option.name}
                    price={option.price}
                  />
                ))}
              </div>
            </StepBlock>
          )}

          {catId === 'pizza' && step === 1 && (
            <StepBlock title="Choose Your Base">
              <div className="space-y-3">
                {PIZZA_BASES.map((option) => {
                  const optionPrice = option.id === 'sausage-stuffed-crust' && activePizzaSize ? activePizzaSize.stuffedCrustPrice : option.price;

                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setPizzaBase(option.id);
                        setPizzaToppings([]);
                        setPizzaSpecials([]);
                        setStep(2);
                      }}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        pizzaBase === option.id ? 'bg-daisy-gold/15 border-daisy-gold' : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-body font-semibold text-white text-sm">{option.name}</p>
                          <p className="text-white/50 text-xs mt-1">{option.id === 'sausage-stuffed-crust' ? 'Premium stuffed crust on selected pizza size' : 'Included with this pizza size'}</p>
                        </div>
                        <span className="text-daisy-gold text-xs font-accent font-semibold">
                          {optionPrice > 0 ? `+${formatCurrency(optionPrice)}` : 'Free'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </StepBlock>
          )}

          {catId === 'pizza' && step === 2 && activePizzaSize && (
            <StepBlock title="Choose Your Protein & Toppings">
              <div className="space-y-2">
                {activePizzaSize.toppings.map((item) => {
                  const selected = pizzaToppings.find((entry) => entry.id === item.id);
                  const quantity = selected ? selected.quantity : 0;
                  const totalForItem = item.price * quantity;

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                          <button
                            type="button"
                            onClick={() => updatePizzaToppingQuantity(item, -1)}
                            className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updatePizzaToppingQuantity(item, 1)}
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

          {catId === 'pizza' && step === 3 && activePizzaSize && (
            <StepBlock title="Add Special Protein Options">
              <div className="space-y-2">
                {activePizzaSize.specials.map((item) => {
                  const selected = pizzaSpecials.find((entry) => entry.id === item.id);
                  const quantity = selected ? selected.quantity : 0;
                  const totalForItem = item.price * quantity;

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                          <button
                            type="button"
                            onClick={() => updatePizzaSpecialQuantity(item, -1)}
                            className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updatePizzaSpecialQuantity(item, 1)}
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

          {catId === 'breakfast-box' && step === 0 && (
            <StepBlock title="Choose what you want in your breakfast box">
              <div className="space-y-2">
                {BREAKFAST_ITEMS.map((item) => {
                  const selected = breakfastItems.find((entry) => entry.id === item.id);
                  const quantity = selected?.quantity || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
                      <span className="text-white text-sm font-body">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-daisy-gold text-xs font-accent">{formatCurrency(item.price)}</span>
                        <button type="button" onClick={() => updateBreakfastItemQuantity(item, -1)} className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label={`Decrease ${item.name}`}><Minus size={12} /></button>
                        <span className="min-w-5 text-center text-white font-accent font-bold">{quantity}</span>
                        <button type="button" onClick={() => updateBreakfastItemQuantity(item, 1)} className="w-7 h-7 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center" aria-label={`Increase ${item.name}`}><Plus size={12} /></button>
                      </div>
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
                {(catId === 'breakfast-box' ? BREAKFAST_DRINKS : DRINK_OPTIONS).map((drink) => {
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

      <div className="fixed bottom-20 sm:bottom-8 md:bottom-0 left-0 right-0 bg-charcoal border-t border-white/10 p-4 z-50" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full sm:w-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-30">
                {step > 0 && (
                  <button
                    onClick={() => {
                      clearSelectionsForStep(step - 1);
                      setStep((s) => s - 1);
                    }}
                    className="px-3 py-2 rounded-full bg-white/10 text-white font-accent font-semibold text-sm"
                  >
                    Back
                  </button>
                )}

                <div className="flex items-center gap-6 rounded-full bg-white/10 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setMultiplier((current) => Math.max(1, current - 1))}
                    className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="min-w-10 text-center text-white font-accent font-bold text-sm">{multiplier}x</span>
                  <button
                    type="button"
                    onClick={() => setMultiplier((current) => current + 1)}
                    className="w-7 h-7 rounded-full bg-daisy-gold text-charcoal flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

            </div>

            <div className="w-full sm:w-auto">
              {step < steps.length - 1 ? (
                <button
                  onClick={() => canContinue && setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="w-full p-3 bg-daisy-gold disabled:opacity-40 disabled:cursor-not-allowed text-charcoal font-accent font-bold py-3 rounded-full mt-2 sm:mt-0"
                >
                  Continue · {formatCurrency(total * multiplier)}
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="w-full p-3 bg-deep-red text-white font-accent font-bold py-3 rounded-full flex items-center justify-center gap-2 mt-2 sm:mt-0"
                >
                  <Check size={16} /> Add Custom Plate to Cart · {formatCurrency(total * multiplier)}
                </button>
              )}
            </div>
          </div>
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
