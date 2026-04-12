import api from "../lib/axios";

export const paymentService = {
  // Admin
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
  // Client
  readBankAccountsClient: async () => {
    const res = await api.get(`/payment/bank-accounts`);
    return res.data;
  },
};
