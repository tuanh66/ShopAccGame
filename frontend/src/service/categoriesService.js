import api from "../lib/axios";

export const categoriesService = {
  // All slug
  readAllSlug: async () => {
    const res = await api.get("/categories/admin/all-slug");
    return res.data;
  },
  // Categories
  createCategories: async (data) => {
    const res = await api.post("/categories/admin", data);
    return res.data;
  },
  readCategories: async () => {
    const res = await api.get("/categories/admin");
    return res.data;
  },
  readCategoriesById: async (id) => {
    const res = await api.get(`/categories/admin/${id}`);
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
  addCategoriesAttribute: async (id, data) => {
    const res = await api.post(`/categories/admin/${id}/attribute`, data);
    return res.data;
  },
  removeCategoriesAttribute: async (id, key) => {
    const res = await api.delete(`/categories/admin/${id}/attribute/${key}`);
    return res.data;
  },
  // Random Categories
  createRandomCategories: async (data) => {
    const res = await api.post("/categories/admin/random-categories", data);
    return res.data;
  },
  readRandomCategories: async () => {
    const res = await api.get("/categories/admin/random-categories");
    return res.data;
  },
  readRandomCategoriesById: async (id) => {
    const res = await api.get(`/categories/admin/random-categories/${id}`);
    return res.data;
  },
  updateRandomCategories: async (id, data) => {
    const res = await api.put(`/categories/admin/random-categories/${id}`, data);
    return res.data;
  },
  deleteRandomCategories: async (id) => {
    const res = await api.delete(`/categories/admin/random-categories/${id}`);
    return res.data;
  },
};
