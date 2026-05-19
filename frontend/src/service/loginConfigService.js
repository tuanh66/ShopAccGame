import api from "../lib/axios";

export const loginConfigService = {
  getLoginConfig: async () => {
    const res = await api.get("/login-config");
    return res.data;
  },
  getPublicLoginConfig: async () => {
    const res = await api.get("/login-config/public");
    return res.data;
  },
  updateLoginConfig: async (data) => {
    const res = await api.put("/login-config", data);
    return res.data;
  },
  
};
