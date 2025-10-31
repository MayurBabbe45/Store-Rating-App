import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Set the token in headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/auth/me');
      console.log('Auth check response:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Server response:', response.data);
      
      const { token, user, message } = response.data;
      
      if (!token || !user) {
        const error = new Error('Invalid response from server');
        error.status = 400;
        throw error;
      }

      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      console.log('Login successful:', message);
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      // Only clear storage on actual auth failures, not validation errors
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      }
      throw error;
    }
  };

  const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const response = await api.put('/auth/profile', updates);
    setUser(response.data.user);
    return response.data.user;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
