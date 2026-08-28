import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import CartItem from './CartItem';
import ProductModal from './ProductModal';
import menuData from '../data/menu.json';

export default function Cart() {
  const { cartItems, isCartOpen, setIsCartOpen, subtotal, itemCount } = useCart();
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (item) => {
    let foundProduct = null;
    let foundCategory = null;
    for (const cat of menuData.categories) {
      const p = cat.products.find((prod) => prod.id === item.productId);
      if (p) { foundProduct = p; foundCategory = cat; break; }
    }
    if (foundProduct) setEditing({ product: foundProduct, category: foundCategory, item });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[75] w-full sm:w-[420px] bg-charcoal border-l border-white/10 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="font-display text-xl font-bold text-white">Your Order 🛒 · {itemCount} item{itemCount !== 1 ? 's' : ''}</h2>
                <button onClick={() => setIsCartOpen(false)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="Close cart">
                  <X size={18} className="text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="text-6xl mb-4 inline-block animate-[spin_6s_linear_infinite]">🌼</div>
                    <p className="text-white/70 font-body mb-4">Your cart is feeling lonely 😔<br />Let's add some flavour!</p>
                    <button
                      onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
                      className="bg-daisy-gold text-charcoal font-accent font-bold px-5 py-2.5 rounded-full"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} onEdit={handleEdit} />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-5 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-white/70 text-sm font-body">
                    <span>Subtotal</span>
                    <span className="font-accent font-semibold text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <p className="text-white/40 text-xs font-body">Delivery fee calculated at checkout</p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-deep-red hover:bg-deep-red/90 text-white font-accent font-bold py-3.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <ShoppingBag size={16} /> Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {editing && (
        <ProductModal
          product={editing.product}
          category={editing.category}
          editingItem={editing.item}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
