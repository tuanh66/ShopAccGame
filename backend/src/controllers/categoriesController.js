import mongoose from "mongoose";
import Categories from "../models/Categories.js";
import RandomCategories from "../models/RandomCategories.js";
import Accounts from "../models/Accounts.js";

const slugify = (text) => {
  return text
    .toString()
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD") // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự đặc biệt
    .replace(/\s+/g, "-") // space -> -
    .replace(/-+/g, "-"); // xoá -- dư
};

const generateAttributeKey = (label) => {
  return label
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
};

export const readAllSlug = async (req, res) => {
  try {
    const slugCategories = await Categories.find().select("slug name -_id");
    const slugRandomCategories = await RandomCategories.find().select("slug name -_id");
    
    return res.status(200).json({
      message: "Lấy tất cả danh mục thành công",
      slugCategories,
      slugRandomCategories,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAllSlug", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Admin
export const createCategories = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "Thiếu tên danh mục hoặc ảnh danh mục",
      });
    }

    // tự tạo slug
    const slug = slugify(name);

    // check trùng slug
    const existed = await Categories.findOne({ slug });
    if (existed) {
      return res.status(409).json({
        message: "Danh mục đã tồn tại",
      });
    }

    const categories = await Categories.create({
      name,
      slug,
      image,
      attributes: {},
    });

    return res.status(201).json({
      message: "Tạo danh mục thành công",
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addCategoriesAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, type, options = [] } = req.body;

    if (!label || !type) {
      return res.status(400).json({
        message: "Thiếu label hoặc type",
      });
    }

    if (type === "select" && options.length === 0) {
      return res.status(400).json({
        message: "Select phải có options",
      });
    }

    const categories = await Categories.findById(id);
    if (!categories) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // sinh key
    const key = generateAttributeKey(label);

    // check trùng key
    if (categories.attributes[key]) {
      return res.status(409).json({
        message: "Thuộc tính đã tồn tại",
      });
    }

    // add attribute
    categories.attributes[key] = {
      type,
      label,
      ...(type === "select" ? { options } : {}),
    };

    // 🔥 BẮT BUỘC
    categories.markModified("attributes");

    await categories.save();

    return res.status(200).json({
      message: "Thêm thuộc tính thành công",
      key,
      data: categories.attributes,
    });
  } catch (error) {
    console.error("Lỗi addCategoriesAttribute:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const removeCategoriesAttribute = async (req, res) => {
  try {
    const { id, key } = req.params;

    const categories = await Categories.findById(id);
    if (!categories) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    if (!categories.attributes[key]) {
      return res.status(404).json({
        message: "Thuộc tính không tồn tại",
      });
    }

    // 1️⃣ Xoá attribute trong categories
    delete categories.attributes[key];
    categories.markModified("attributes");
    await categories.save();

    // 2️⃣ Xoá attribute đó trong tất cả account
    await Accounts.updateMany(
      { categories_id: id },
      { $unset: { [`attributes.${key}`]: "" } },
    );

    return res.status(200).json({
      message: "Xoá thuộc tính thành công",
      data: categories.attributes,
    });
  } catch (error) {
    console.error("Lỗi removeCategoriesAttribute:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readCategories = async (req, res) => {
  try {
    const categories = await Categories.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy danh mục thành công",
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await Categories.findById(id).select(
      "name slug image attributes status",
    );

    if (!categories) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    return res.status(200).json({
      message: "Lấy danh mục thành công",
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi readCategoriesById:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, status } = req.body;

    const categories = await Categories.findById(id);
    if (!categories) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // đổi tên -> tự đổi slug
    if (name !== undefined) {
      categories.name = name;
      categories.slug = slugify(name);
    }

    if (image !== undefined) {
      categories.image = image;
    }

    if (status !== undefined) {
      categories.status = status;
    }

    await categories.save();

    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await Categories.findById(id);
    if (!categories) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    await Accounts.deleteMany({ categories_id: id });

    await Categories.findByIdAndDelete(id);

    return res.status(200).json({
      message: `Đã xoá danh mục ${categories.name} và toàn bộ dữ liệu liên quan`,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// Random
export const createRandomCategories = async (req, res) => {
  try {
    const { name, image, price, chance, status } = req.body;
    const slug = slugify(name);

    const newCategory = await RandomCategories.create({
      name,
      slug,
      image,
      price,
      chance,
      status,
    });

    return res.status(201).json({
      message: "Tạo danh mục random thành công",
      data: newCategory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createRandomCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readRandomCategories = async (req, res) => {
  try {
    const categories = await RandomCategories.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy danh sách danh mục random thành công",
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readRandomCategoriesById = async (req, res) => {
  try {
    const { id } = req.params; // randomCategoriesId (số)
    const category = await RandomCategories.findOne({ randomCategoriesId: id });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({
      message: "Lấy chi tiết danh mục random thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomCategoriesById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateRandomCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, price, chance, status } = req.body;

    const updateData = { image, price, chance, status };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }

    const category = await RandomCategories.findOneAndUpdate(
      { randomCategoriesId: id },
      { $set: updateData },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({
      message: "Cập nhật danh mục random thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateRandomCategoriesById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteRandomCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await RandomCategories.findOneAndDelete({
      randomCategoriesId: id,
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({ message: "Xóa danh mục random thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi deleteRandomCategoriesById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Client
export const readCategoriesStatus = async (req, res) => {
  try {
    // 1. Lấy danh mục thường và đếm số nick chưa bán
    const categories = await Categories.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          from: "accounts",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$categories_id", "$$categoryId"] },
                status: false,
              },
            },
            { $count: "total" },
          ],
          as: "account_count",
        },
      },
      {
        $addFields: {
          totalAccount: {
            $ifNull: [{ $arrayElemAt: ["$account_count.total", 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          slug: 1,
          image: 1,
          totalAccount: 1,
          createdAt: 1,
        },
      },
    ]);

    // 2. Lấy danh mục Random và đếm số nick chưa bán
    const randomCategories = await RandomCategories.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          from: "randomaccounts",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$randomCategories_id", "$$categoryId"] },
                status: false,
              },
            },
            { $count: "total" },
          ],
          as: "account_count",
        },
      },
      {
        $addFields: {
          totalAccount: {
            $ifNull: [{ $arrayElemAt: ["$account_count.total", 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          slug: 1,
          image: 1,
          price: 1,
          totalAccount: 1,
          createdAt: 1,
          isRandom: { $literal: true },
        },
      },
    ]);

    // 3. Gộp 2 mảng và sắp xếp theo ngày tạo (cũ nhất lên đầu)
    const combinedCategories = [...categories, ...randomCategories].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: combinedCategories,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCategoriesStatus", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
