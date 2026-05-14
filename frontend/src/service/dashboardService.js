import api from "../lib/axios.js";

export const dashboardService = {
  getStats: async () => {
    const res = await api.get("/dashboard/stats");
    return res.data;
  },
};
