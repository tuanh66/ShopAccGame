import api from "../lib/axios";

export const historyService = {
  // Admin
  // Lịch sử chuyển khoản
  bankAccountsHistory: async () => {
    const res = await api.get("/history/admin/bank-accounts");
    return res.data;
  },
  // Lịch sử nạp thẻ
  cardTopUpHistory: async () => {
    const res = await api.get("/history/admin/card-top-up");
    return res.data;
  },
  // Lịch sử mã giảm giá
  discountCodeHistory: async () => {
    const res = await api.get("/history/admin/discount-code");
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
};
