import api from "../lib/axios";

export const userService = {
  // Admin
  readUser: async (id) => {
    const res = await api.get(`/users/admin/${id}`);
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