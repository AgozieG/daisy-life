import { motion } from 'framer-motion';
import { Minus, Plus, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';

export default function CartItem({ item, onEdit }) {
  const { removeItem, setQuantity } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 bg-white/5 rounded-xl p-3"
    >
      <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-white font-body font-semibold text-sm leading-tight">{item.productName}</h4>
          <span className="text-daisy-gold font-accent font-bold text-sm shrink-0">{formatCurrency(item.lineTotal)}</span>
        </div>
        {item.selectedVariant && <p className="text-white/50 text-xs mt-0.5">Size: {item.selectedVariant}</p>}
        {item.selectedFlavours?.length > 0 && (
          <p className="text-white/50 text-xs mt-0.5">Flavour: {item.selectedFlavours.join(', ')}</p>
        )}
        {item.selectedToppings?.length > 0 && (
          <p className="text-white/50 text-xs mt-0.5">Extras: {item.selectedToppings.map((t) => t.name).join(', ')}</p>
        )}
        {item.selectedDrink && <p className="text-white/50 text-xs mt-0.5">Drink: {item.selectedDrink}</p>}
        {item.specialInstructions && (
          <p className="text-white/40 text-xs mt-0.5 italic truncate">"{item.specialInstructions}"</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90"
              aria-label="Decrease"
            >
              <Minus size={12} />
            </button>
            <span className="text-white text-xs font-accent w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => setQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 rounded-full bg-daisy-gold flex items-center justify-center text-charcoal active:scale-90"
              aria-label="Increase"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onEdit(item)} className="text-white/50 hover:text-daisy-gold" aria-label="Edit item">
              <Pencil size={14} />
            </button>
            <button onClick={() => removeItem(item.id)} className="text-white/50 hover:text-deep-red" aria-label="Remove item">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
