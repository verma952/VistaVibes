import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 for initial auth load

  useEffect(() => {
    const storedUser = localStorage.getItem('vistavibes-user');
    const storedToken = localStorage.getItem('vistavibes-token');

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // ✅ auth loaded
  }, []);

  const login = ({ user, token }) => {
    localStorage.setItem('vistavibes-user', JSON.stringify(user));
    localStorage.setItem('vistavibes-token', token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('vistavibes-user');
    localStorage.removeItem('vistavibes-token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
