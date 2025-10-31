import api from './api';

// Get dashboard stats
export const getDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// Create user
export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

// Get all users
export const getUsers = async (filters = {}) => {
  const response = await api.get('/admin/users', { params: filters });
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

// Create store
export const createStore = async (storeData) => {
  const response = await api.post('/admin/stores', storeData);
  return response.data;
};

// Get all stores
export const getStores = async (filters = {}) => {
  const response = await api.get('/admin/stores', { params: filters });
  return response.data;
};
