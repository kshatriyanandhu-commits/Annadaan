import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem('annadaan_auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.token && parsed?.user) {
            setToken(parsed.token);
            setUser(parsed.user);

            try {
              const res = await authApi.getMe();
              if (res.data?.user) {
                setUser(res.data.user);
                localStorage.setItem(
                  'annadaan_auth',
                  JSON.stringify({ token: parsed.token, user: res.data.user })
                );
              }
            } catch (err) {
              console.warn('[AuthContext] Session expired on backend verification');
            }
          }
        }
      } catch (err) {
        console.error('[AuthContext] Initialization failed:', err);
        localStorage.removeItem('annadaan_auth');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleAuthReset = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('annadaan_auth_reset', handleAuthReset);
    return () => window.removeEventListener('annadaan_auth_reset', handleAuthReset);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem(
      'annadaan_auth',
      JSON.stringify({ token: receivedToken, user: receivedUser })
    );

    return receivedUser;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem(
      'annadaan_auth',
      JSON.stringify({ token: receivedToken, user: receivedUser })
    );

    return receivedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('annadaan_auth');
  };

  const isDonor = user?.role === 'donor';
  const isNGO = user?.role === 'ngo';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isDonor,
        isNGO,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
