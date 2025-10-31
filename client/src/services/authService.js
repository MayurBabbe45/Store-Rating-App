import api from './api';

// User signup
export const signup = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  return response.data;
};

// User login
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

// Change password
export const changePassword = async (passwords) => {
  const response = await api.put('/api/auth/change-password', passwords);
  return response.data;
};
