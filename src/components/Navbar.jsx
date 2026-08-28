import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Create Your Plate', to: '/create-your-plate' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-charcoal/85 backdrop-blur-lg border-b border-white/10 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-fun text-daisy-gold text-2xl sm:text-3xl">
          <span aria-hidden className="inline-block animate-[spin_6s_linear_infinite]">🌼</span> Daisy Life
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-base lg:text-lg font-medium">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-white/90 hover:text-daisy-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={19} className="text-white" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className="absolute -top-1 -right-1 bg-deep-red text-white text-[10px] font-accent font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-daisy-gold/20 flex items-center justify-center text-daisy-gold font-accent font-bold text-sm">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase() || <User size={16} />
                )}
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-white/70 hover:text-hot-orange transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-block bg-daisy-gold text-charcoal font-accent font-bold text-base px-5 py-2.5 rounded-full hover:brightness-105 active:scale-95 transition-all"
            >
              Sign In
            </Link>
          )}

          <button
            className="md:hidden w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={19} className="text-white" /> : <MenuIcon size={19} className="text-white" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-charcoal/95 backdrop-blur-lg border-t border-white/10 mt-3"
        >
          <div className="flex flex-col px-6 py-4 gap-4 font-body text-base">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-daisy-gold text-base">
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-daisy-gold font-bold text-base">
                Sign In
              </Link>
            )}
            {user && (
              <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="text-left text-hot-orange text-base">
                Sign Out
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
