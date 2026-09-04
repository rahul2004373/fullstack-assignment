import api from "./axios";

export const adminApi = {
  getDashboardStats: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },

  getUsers: async (params = {}) => {
    const res = await api.get("/users", { params });
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post("/users", userData);
    return res.data;
  },
};
