import { createContext, useState, useEffect, useCallback } from 'react';

export const UserContext = createContext(null);

const USER_KEY = 'daisy_user';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(USER_KEY);
    }
    setReady(true);
  }, []);

  const login = useCallback((profile) => {
    const fullProfile = { state: 'Enugu', ...profile };
    setUser(fullProfile);
    localStorage.setItem(USER_KEY, JSON.stringify(fullProfile));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('daisy_cart');
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
}
