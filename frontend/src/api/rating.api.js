import api from "./axios";

export const ratingApi = {
  submitRating: async (storeId, rating) => {
    const res = await api.post(`/ratings/${storeId}`, { rating });
    return res.data;
  },

  getMyRating: async (storeId) => {
    const res = await api.get(`/ratings/${storeId}/my`);
    return res.data;
  },

  getStoreRatings: async (storeId, params = {}) => {
    const res = await api.get(`/ratings/${storeId}`, { params });
    return res.data;
  },
};
