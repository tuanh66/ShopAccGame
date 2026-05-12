import api from "../lib/axios";

export const accountsService = {
  // Admin
  // Accounts
  createAccounts: async (data) => {
    const res = await api.post("/accounts/admin", data);
    return res.data;
  },
  readAccountsAttributeBySlugCategories: async (slug) => {
    const res = await api.get(`/accounts/admin/attributes/${slug}`);
    return res.data;
  },
  readAccounts: async (slug) => {
    const res = await api.get(`/accounts/admin/category/${slug}`);
    return res.data;
  },
  readAccountById: async (id) => {
    const res = await api.get(`/accounts/admin/detail/${id}`);
    return res.data;
  },
  updateAccount: async (id, data) => {
    const res = await api.put(`/accounts/admin/${id}`, data);
    return res.data;
  },
  deleteAccount: async (id) => {
    const res = await api.delete(`/accounts/admin/${id}`);
    return res.data;
  },
  // Random Accounts
  createRandomAccounts: async (data) => {
    const res = await api.post("/accounts/admin/random", data);
    return res.data;
  },
  readRandomAccounts: async (slug) => {
    const res = await api.get(`/accounts/admin/random/${slug}`);
    return res.data;
  },
  readRandomAccountById: async (id) => {
    const res = await api.get(`/accounts/admin/random/detail/${id}`);
    return res.data;
  },
  updateRandomAccount: async (id, data) => {
    const res = await api.put(`/accounts/admin/random/${id}`, data);
    return res.data;
  },
  deleteRandomAccount: async (id) => {
    const res = await api.delete(`/accounts/admin/random/${id}`);
    return res.data;
  },
  // Client
  readCategoriesAccountStatus: async (slug) => {
    const res = await api.get(`/accounts/${slug}`);
    return res.data;
  },
  readCategoriesAccountId: async (slug, id) => {
    const res = await api.get(`/accounts/${slug}/${id}`);
    return res.data;
  },
  buyAccount: async (id) => {
    const res = await api.post(`/accounts/${id}/buy-account`);
    return res.data;
  },
  readAccountBoughtDetail: async (id) => {
    const res = await api.get(`/accounts/bought-detail/${id}`);
    return res.data;
  },
};
