import api from './api';

// Get all stores (for normal users)
export const getStores = async (filters = {}) => {
  const response = await api.get('/stores', { params: filters });
  return response.data;
};

// Submit rating
export const submitRating = async (ratingData) => {
  const response = await api.post('/ratings', ratingData);
  return response.data;
};

// Get store owner dashboard
export const getOwnerDashboard = async () => {
  const response = await api.get('/store-owner/dashboard');
  return response.data;
};
