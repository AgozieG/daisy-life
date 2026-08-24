import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export default function BottomNav() {
  const { itemCount, setIsCartOpen } = useCart();

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 text-[10px] font-body py-1 ${isActive ? 'text-daisy-gold' : 'text-white/60'}`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal/95 backdrop-blur-lg border-t border-white/10 flex justify-around items-center px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <NavLink to="/" className={linkClass} end>
        <Home size={20} />
        Home
      </NavLink>
      <NavLink to="/menu" className={linkClass}>
        <UtensilsCrossed size={20} />
        Menu
      </NavLink>
      <NavLink to="/create-your-plate" className={linkClass}>
        <Sparkles size={20} />
        Create
      </NavLink>
      <button onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center gap-0.5 text-[10px] font-body text-white/60">
        <ShoppingBag size={20} />
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-1 right-1 bg-deep-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}
