// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { customFetch } from '../utils/customFetch';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Automatically check if a user is logged in whenever the page refreshes
  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Hit our protected backend /me endpoint from Step 11 to verify the token
        const userData = await customFetch('/auth/me');
        setUser(userData);
      } catch (error) {
        console.error('Session expired or invalid token:', error.message);
        localStorage.removeItem('token'); // Clear broken token
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // Login handler function
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar
    });
  };

  // Logout handler function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom shortcut hook so we don't have to import useContext(AuthContext) everywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};