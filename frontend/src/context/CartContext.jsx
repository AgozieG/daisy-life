import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { generateId } from '../utils/generateId';

export const CartContext = createContext(null);

const CART_KEY = 'daisy_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {
      localStorage.removeItem(CART_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const addItem = useCallback((item) => {
    setCartItems((prev) => [...prev, { ...item, id: item.id || generateId() }]);
    setIsCartOpen(true);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setCartItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  }, []);

  const removeItem = useCallback((id) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const setQuantity = useCallback((id, qty) => {
    setCartItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const quantity = Math.max(1, qty);
        return { ...it, quantity, lineTotal: it.unitPrice * quantity };
      })
    );
  }, []);

  const itemCount = useMemo(() => cartItems.reduce((sum, it) => sum + it.quantity, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((sum, it) => sum + it.lineTotal, 0), [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, updateItem, removeItem, clearCart, setQuantity, itemCount, subtotal, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}
