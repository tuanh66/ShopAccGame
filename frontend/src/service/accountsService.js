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
  readAccounts: async (slug, page = 1, limit = 10, search = "") => {
    const res = await api.get(`/accounts/admin/category/${slug}?page=${page}&limit=${limit}&search=${search}`);
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
  readCategoriesAccountStatus: async (slug, params) => {
    const res = await api.get(`/accounts/${slug}`, { params });
    return res.data;
  },
  readCategoriesAccountId: async (slug, id) => {
    const res = await api.get(`/accounts/${slug}/${id}`);
    return res.data;
  },
  buyAccount: async (id, data) => {
    const res = await api.post(`/accounts/${id}/buy-account`, data);
    return res.data;
  },
  readRandomAccountsStatus: async (slug) => {
    const res = await api.get(`/accounts/random/${slug}`);
    return res.data;
  },
  buyRandomAccounts: async (id, data) => {
    const res = await api.post(`/accounts/random/${id}/buy-account`, data);
    return res.data;
  },
};
