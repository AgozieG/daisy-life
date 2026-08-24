import { createContext, useState, useCallback } from 'react';
import { generateId } from '../utils/generateId';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return <ToastContext.Provider value={{ toasts, showToast }}>{children}</ToastContext.Provider>;
}
