import api from "../lib/axios";

export const categoriesService = {
  createCategories: async (data) => {
    const res = await api.post("/categories/admin", data);
    return res.data;
  },
  readCategories: async () => {
    const res = await api.get("/categories/admin");
    return res.data;
  },
  updateCategories: async (id, data) => {
    const res = await api.put(`/categories/admin/${id}`, data);
    return res.data;
  },
  deleteCategories: async (id) => {
    const res = await api.delete(`/categories/admin/${id}`);
    return res.data;
  },    
};
