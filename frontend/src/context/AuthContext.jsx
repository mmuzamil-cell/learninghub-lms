import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUserApi, registerUserApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('learnhub_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('learnhub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginUserApi({ email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('learnhub_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (payload) => {
    const response = await registerUserApi(payload);
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('learnhub_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnhub_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
