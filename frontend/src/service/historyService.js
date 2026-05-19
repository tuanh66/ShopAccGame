import api from "../lib/axios";

export const historyService = {
  // Admin
  // Lịch sử giao dịch
  readUserTransactionHistoryAdmin: async (
    page = 1,
    limit = 10,
    search = "",
    today = false,
  ) => {
    const res = await api.get(
      `/history/admin/transaction-history?page=${page}&limit=${limit}&search=${search}&today=${today}`,
    );
    return res.data;
  },
  // Lịch sử mua tài khoản
  readAccountsBoughtHistoryAdmin: async (page = 1, limit = 10, search = "") => {
    const res = await api.get(
      `/history/admin/accounts-bought?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },
  // Lịch sử mua random
  readRandomAccountsBoughtHistoryAdmin: async (
    page = 1,
    limit = 10,
    search = "",
  ) => {
    const res = await api.get(
      `/history/admin/random-accounts-bought?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },
  // Lịch sử chuyển khoản
  bankAccountsHistory: async (page = 1, limit = 10, search = "") => {
    const res = await api.get(
      `/history/admin/bank-accounts?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },
  // Lịch sử nạp thẻ
  cardTopUpHistory: async (page = 1, limit = 10, search = "") => {
    const res = await api.get(
      `/history/admin/card-top-up?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },
  // Lịch sử mã giảm giá
  discountCodeHistory: async (page = 1, limit = 10, search = "") => {
    const res = await api.get(
      `/history/admin/discount-code?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },

  // Client
  // Lịch sử giao dịch
  readUserTransactionHistory: async () => {
    const res = await api.get("/history/transaction-history");
    return res.data;
  },
  readUserTransactionHistoryById: async (userId) => {
    const res = await api.get(`/history/transaction-history/${userId}`);
    return res.data;
  },
  // Tài khoản đã mua
  readAccountsBoughtHistory: async () => {
    const res = await api.get("/history/accounts-bought-history");
    return res.data;
  },
  readAccountsBoughtHistoryById: async (id, params) => {
    const res = await api.get(`/history/accounts-bought-history/${id}`, {
      params,
    });
    return res.data;
  },
  updatePasswordStatus: async (id, params) => {
    const res = await api.post(
      `/history/accounts-bought-history/${id}/get-password`,
      null,
      { params },
    );
    return res.data;
  },
};
