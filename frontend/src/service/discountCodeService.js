import api from "../lib/api";

export const discountCodeService = {
  createDiscountCode: async (data) => {
    const res = await api.post(`/admin/discount-code`, data);
    return res.data;
  },
  readDiscountCode: async () => {
    const res = await api.get(`/admin/discount-code`);
    return res.data;
  },
  updateDiscountCode: async (data) => {
    const res = await api.put(`/admin/discount-code`, data);
    return res.data;
  },
  deleteDiscountCode: async (data) => {
    const res = await api.delete(`/admin/discount-code`, data);
    return res.data;
  },
};

