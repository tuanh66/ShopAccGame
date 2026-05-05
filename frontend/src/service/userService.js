import api from "../lib/axios";

export const userService = {
  // Admin
  readUser: async (id, page = 1, limit = 10) => {
    const res = await api.get(`/users/admin/${id}?page=${page}&limit=${limit}`);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/users/admin/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/users/admin/${id}`);
    return res.data;
  },
};