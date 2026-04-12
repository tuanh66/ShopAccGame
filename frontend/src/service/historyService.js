import api from "../lib/axios";

export const historyService = {
  bankAccountsHistory: async () => {
    const res = await api.get("/history/admin/bank-accounts");
    return res.data;
  },
  cardTopUpHistory: async () => {
    const res = await api.get("/history/admin/card-top-up");
    return res.data;
  },
  discountCodeHistory: async () => {
    const res = await api.get("/history/admin/discount-code");
    return res.data;
  },
};
