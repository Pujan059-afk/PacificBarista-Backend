import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      api
        .get('/auth/me')
        .then((res) => {
          const userData = res.data.user || res.data;
          setUser(userData);
          setIsAuthenticated(true);
          setAdmin(userData.role === 'admin' || userData.role === 'superadmin');
          setSuperAdmin(userData.role === 'superadmin');
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    const { token, user: userData } = res.data;
    const userInfo = userData || res.data;
    localStorage.setItem('token', token);
    setUser(userInfo);
    setIsAuthenticated(true);
    setAdmin(userInfo.role === 'admin' || userInfo.role === 'superadmin');
    setSuperAdmin(userInfo.role === 'superadmin');
    return userInfo;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setAdmin(false);
    setSuperAdmin(false);
  }, []);

  const value = { user, isAuthenticated, admin, superAdmin, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
