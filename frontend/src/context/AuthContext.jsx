import React, { createContext, useState, useEffect, useContext } from 'react';
import { customFetch } from '../utils/customFetch';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const userData = await customFetch('/auth/me');
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  const login = (userData) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar,
    });
  };

  const logout = async () => {
    try {
      await customFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error.message);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
