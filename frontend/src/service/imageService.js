import axios from "axios";

export const imageService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData,
      );

      return res.data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  uploadImages: async (files) => {
    try {
      const uploadPromises = files.map((file) => imageService.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },
};
