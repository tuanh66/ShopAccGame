import Social from "../models/Social.js";

export const getSocialPublic = async (req, res) => {
  try {
    let social = await Social.findOne().select("-_id -__v");
    // Nếu chưa có cấu hình nào, tự động tạo mới bản ghi mặc định
    if (!social) {
      social = await Social.create({
        social: {
          facebook: "",
          youtube: "",
          telegram: "",
          discord: "",
          tiktok: "",
          zalo: "",
        },
        time: "",
      });
    }
    return res.status(200).json({
      message: "Lấy thông tin mạng xã hội thành công",
      data: social,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getSocial", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getSocial = async (req, res) => {
  try {
    let social = await Social.findOne().select("-_id -__v -createdAt -updatedAt");
    // Nếu chưa có cấu hình nào, tự động tạo mới bản ghi mặc định
    if (!social) {
      social = await Social.create({
        social: {
          facebook: "",
          youtube: "",
          telegram: "",
          discord: "",
          tiktok: "",
          zalo: "",
        },
        time: "",
      });
    }
    return res.status(200).json({
      message: "Lấy thông tin mạng xã hội thành công",
      data: social,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getSocial", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateSocial = async (req, res) => {
  try {
    const { social, time } = req.body;
    const updatedSocial = await Social.findOneAndUpdate(
      {},
      { social, time },
      { new: true, upsert: true }
    ).select("-_id -__v");
    
    return res.status(200).json({
      message: "Cập nhật thông tin mạng xã hội thành công",
      data: updatedSocial,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateSocial", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};