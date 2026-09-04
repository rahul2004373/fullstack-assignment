import api from "./axios";

export const storeApi = {
  getStores: async (params = {}) => {
    const res = await api.get("/stores", { params });
    return res.data;
  },

  searchStores: async (params = {}) => {
    const res = await api.get("/stores/search", { params });
    return res.data;
  },

  getStoreById: async (id) => {
    const res = await api.get(`/stores/${id}`);
    return res.data;
  },

  createStore: async (storeData) => {
    const res = await api.post("/stores", storeData);
    return res.data;
  },

  getMyStore: async (params = {}) => {
    const res = await api.get("/stores/owner/my-store", { params });
    return res.data;
  },

  getOwnerDashboard: async (storeId, params = {}) => {
    const res = await api.get(`/stores/${storeId}/dashboard`, { params });
    return res.data;
  },
};
