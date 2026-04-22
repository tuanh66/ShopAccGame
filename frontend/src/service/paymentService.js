import api from "../lib/axios";

export const paymentService = {
  // Admin
  // Bank Accounts
  createBankAccount: async (data) => {
    const res = await api.post(`/payment/admin/bank-accounts`, data);
    return res.data;
  },
  readBankAccounts: async () => {
    const res = await api.get(`/payment/admin/bank-accounts`);
    return res.data;
  },
  updateBankAccount: async (data) => {
    const res = await api.put(`/payment/admin/bank-accounts`, data);
    return res.data;
  },
  // Card Top Up
  createCardTopUp: async (data) => {
    const res = await api.post(`/payment/admin/card-top-up`, data);
    return res.data;
  },
  readCardTopUp: async () => {
    const res = await api.get(`/payment/admin/card-top-up`);
    return res.data;
  },
  updateCardTopUp: async (data) => {
    const res = await api.put(`/payment/admin/card-top-up`, data);
    return res.data;
  },
  // Telecom
  createTelecom: async (data) => {
    const res = await api.post(`/payment/admin/telecom`, data);
    return res.data;
  },
  readTelecom: async () => {
    const res = await api.get(`/payment/admin/telecom`);
    return res.data;
  },
  updateTelecom: async (id, data) => {
    const res = await api.put(`/payment/admin/telecom/${id}`, data);
    return res.data;
  },
  deleteTelecom: async (id) => {
    const res = await api.delete(`/payment/admin/telecom/${id}`);
    return res.data;
  },
  // Client
  // Bank Accounts
  readBankAccountsClient: async () => {
    const res = await api.get(`/payment/bank-accounts`);
    return res.data;
  },
  // Card Top Up
  submitCardTopUp: async (data) => {
    const res = await api.post(`/payment/submit-card-top-up`, data);
    return res.data;
  },
  readCardTopUpClient: async () => {
    const res = await api.get(`/payment/card-top-up`);
    return res.data;
  },
};
