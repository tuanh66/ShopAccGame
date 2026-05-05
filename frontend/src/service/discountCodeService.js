import api from "../lib/axios";

export const discountCodeService = {
  createDiscountCode: async (data) => {
    const res = await api.post(`/discount-code/admin`, data);
    return res.data;
  },
  readDiscountCode: async () => {
    const res = await api.get(`/discount-code/admin`);
    return res.data;
  },
  readDiscountCodeById: async (id) => {
    const res = await api.get(`/discount-code/admin/${id}`);
    return res.data;
  },
  updateDiscountCode: async (id, data) => {
    const res = await api.put(`/discount-code/admin/${id}`, data);
    return res.data;
  },
  deleteDiscountCode: async (id) => {
    const res = await api.delete(`/discount-code/admin/${id}`);
    return res.data;
  },
  applyDiscountCode: async (data) => {
    const res = await api.post(`/discount-code/apply`, data);
    return res.data;
  },
};

