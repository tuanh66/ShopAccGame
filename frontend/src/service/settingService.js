import api from "../lib/axios"

export const settingService = {
    getPublicSocial: async () => {
        const response = await api.get("/settings/social/public");
        return response.data;
    },
    getSocial: async () => {
        const response = await api.get("/settings/social");
        return response.data;
    },
    updateSocial: async (data) => {
        const response = await api.put("/settings/social", data);
        return response.data;
    },
}   