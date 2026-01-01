import AccountCategory from "../models/AccountCategory.js";
import AccountDetail from "../models/AccountDetail.js";

const slugify = (text) => {
  return text
    .toString()
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
    .normalize("NFD") // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự đặc biệt
    .replace(/\s+/g, "_") // space -> _
    .replace(/_+/g, "_"); // xoá __ dư
};

// Admin

const generateAccountCode = (prefix = "DTU") => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6 số
  return `${prefix}${randomNumber}`;
};

export const readAccountCategory = async (req, res) => {};

export const createAccountCategory = async (req, res) => {
  try {
    const { name_category, image_category } = req.body;

    if (!name_category || !image_category) {
      return res.status(400).json({
        message: "Thiếu name_category hoặc image_category",
      });
    }

    // tự tạo slug
    const slug_category = slugify(name_category);

    // check trùng slug
    const existed = await AccountCategory.findOne({ slug_category });
    if (existed) {
      return res.status(409).json({
        message: "Danh mục đã tồn tại",
      });
    }

    const category = await AccountCategory.create({
      name_category,
      slug_category,
      image_category,
      attributes_category: {},
    });

    return res.status(201).json({
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createAccountCategory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addAccountCategoryAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, type, options = [] } = req.body;

    if (!label || !type) {
      return res.status(400).json({
        message: "Thiếu label hoặc type",
      });
    }

    const category = await AccountCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // sinh key
    const key = generateAttributeKey(label);

    // check trùng key
    if (category.attributes_category[key]) {
      return res.status(409).json({
        message: "Thuộc tính đã tồn tại",
      });
    }

    // add attribute
    category.attributes_category[key] = {
      type,
      label,
      ...(type === "select" ? { options } : {}),
    };

    // 🔥 BẮT BUỘC
    category.markModified("attributes_category");

    await category.save();

    return res.status(200).json({
      message: "Thêm thuộc tính thành công",
      key,
      data: category.attributes_category,
    });
  } catch (error) {
    console.error("Lỗi addCategoryAttribute:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const removeAccountCategoryAttribute = async (req, res) => {
  try {
    const { id, key } = req.params;

    const category = await AccountCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    if (!category.attributes_category[key]) {
      return res.status(404).json({
        message: "Thuộc tính không tồn tại",
      });
    }

    delete category.attributes_category[key];
    category.markModified("attributes_category");

    await category.save();

    return res.status(200).json({
      message: "Xoá thuộc tính thành công",
      data: category.attributes_category,
    });
  } catch (error) {
    console.error("Lỗi removeCategoryAttribute:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateAccountCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_category, image_category, status, attributes_category } =
      req.body;

    const category = await AccountCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // đổi tên -> tự đổi slug
    if (name_category !== undefined) {
      category.name_category = name_category;
      category.slug_category = slugify(name_category);
    }

    if (image_category !== undefined) {
      category.image_category = image_category;
    }

    if (status !== undefined) {
      category.status = status;
    }

    /**
     * attributes_category
     * - gửi object mới -> ghi đè
     * - gửi {} -> xoá hết
     * - không gửi -> giữ nguyên
     */
    // if (attributes_category !== undefined) {
    //   category.attributes_category = attributes_category;
    // }

    await category.save();

    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateAccountCategory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteAccountCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await AccountCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    return res.status(200).json({
      message: `Đã xoá danh mục ${category.name_game}`,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteAccountCategory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountDetail = async (req, res) => {
  try {
  } catch (error) {
    console.error("Lỗi khi gọi readAccountDetail", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createAccountDetail = async (req, res) => {
  try {
    const {
      category_id,
      user_detail,
      password_detail,
      price_detail,
      price_old_detail,
      image_detail = [],
      attributes_detail = {},
    } = req.body;

    // 2️⃣ kiểm tra category
    const category = await AccountCategory.findById(category_id);
    if (!category) {
      return res.status(404).json({
        message: "Category không tồn tại",
      });
    }

    const categoryAttributes = category.attributes_category || {};

    // 3️⃣ validate attributes
    for (const [key, value] of Object.entries(attributes_detail)) {
      const attr = categoryAttributes[key];
      if (!attr) {
        return res.status(400).json({
          message: `Thuộc tính không hợp lệ: ${key}`,
        });
      }

      if (attr.type === "number" && typeof value !== "number") {
        return res.status(400).json({
          message: `${key} phải là number`,
        });
      }

      if (attr.type === "select" && !attr.options.includes(value)) {
        return res.status(400).json({
          message: `Giá trị không hợp lệ cho ${key}`,
        });
      }
    }

    // 4️⃣ sinh slug acc
    let slug_detail;
    let isExist = true;
    while (isExist) {
      slug_detail = generateAccountCode("DTU");
      const check = await AccountDetail.findOne({ slug_detail });
      if (!check) isExist = false;
    }

    // 5️⃣ tạo account detail
    const account = await AccountDetail.create({
      category_id,
      user_detail,
      password_detail,
      price_detail,
      price_old_detail,
      slug_detail,
      image_detail,
      attributes_detail,
    });

    return res.status(201).json({
      message: "Tạo account thành công",
      data: account,
    });
  } catch (error) {
    if (error.code === 11000) {
      const user = error.keyValue?.user_detail;
      return res.status(409).json({
        message: `Tài khoản ${user} đã tồn tại trong danh mục này`,
      });
    }

    console.error("Lỗi khi gọi createAccountDetail", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateAccountDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_detail,
      password_detail,
      price_detail,
      price_old_detail,
      image_detail,
      attributes_detail,
      status,
    } = req.body;

    // 1. tìm account
    const account = await AccountDetail.findById(id);
    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    // 2. update field thường
    if (user_detail !== undefined) account.user_detail = user_detail;
    if (password_detail !== undefined)
      account.password_detail = password_detail;
    if (price_detail !== undefined) account.price_detail = price_detail;
    if (price_old_detail !== undefined)
      account.price_old_detail = price_old_detail;
    if (image_detail !== undefined) account.image_detail = image_detail;
    if (status !== undefined) account.status = status;

    // 3. update attributes_detail (nếu có gửi)
    if (attributes_detail !== undefined) {
      // lấy category để validate
      const category = await AccountCategory.findById(account.category_id);
      if (!category) {
        return res.status(404).json({
          message: "Danh mục không tồn tại",
        });
      }

      const categoryAttributes = category.attributes_category || {};

      // validate giống create
      for (const key in attributes_detail) {
        const value = attributes_detail[key];
        const config = categoryAttributes[key];

        if (!config) {
          return res.status(400).json({
            message: `Thuộc tính ${key} không tồn tại trong category`,
          });
        }

        if (config.type === "select") {
          if (!config.options.includes(value)) {
            return res.status(400).json({
              message: `Giá trị không hợp lệ cho ${config.label}`,
            });
          }
        }

        if (config.type === "number") {
          if (typeof value !== "number") {
            return res.status(400).json({
              message: `${config.label} phải là số`,
            });
          }
        }
      }

      // merge attributes (không ghi đè toàn bộ)
      account.attributes_detail = {
        ...account.attributes_detail,
        ...attributes_detail,
      };

      account.markModified("attributes_detail");
    }

    await account.save();

    return res.status(200).json({
      message: "Cập nhật account thành công",
      data: account,
    });
  } catch (error) {
    if (error.code === 11000) {
      const user = error.keyValue?.user_detail;
      return res.status(409).json({
        message: `Tài khoản ${user} đã tồn tại trong danh mục này`,
      });
    }

    console.error("Lỗi khi gọi updateAccountDetail", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteAccountDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await AccountDetail.findByIdAndDelete(id);

    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    return res.status(200).json({
      message: "Xoá account thành công",
      data: account,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteAccountDetail", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Client

export const readAccountCategoryClient = async (req, res) => {
  try {
    const category = await AccountCategory.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          from: "accountdetails",
          localField: "_id",
          foreignField: "category_id",
          as: "accounts",
        },
      },
      {
        $project: {
          name_category: 1,
          slug_category: 1,
          image_category: 1,
          count: { $size: "$accounts" },
        },
      },
    ]);

    return res.status(200).json({
      message: "Lấy danh sách thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccountCategory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountByCategorySlug = async (req, res) => {
  try {
    const { slugCategory } = req.params;

    // 1. tìm category theo slug
    const category = await AccountCategory.findOne({
      slug_category: slugCategory,
      status: true,
    });

    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // 2. lấy account theo category_id
    const accounts = await AccountDetail.find(
      {
        category_id: category._id,
        status: true,
      },
      {
        price_detail: 1,
        price_old_detail: 1,
        slug_detail: 1,
        image_detail: 1,
        attributes_detail: 1,
      }
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Lấy danh sách account thành công",
      category: {
        id: category._id,
        name: category.name_category,
        slug: category.slug_category,
        attributes: category.attributes_category,
      },
      data: accounts,
    });
  } catch (error) {
    console.error("Lỗi readAccountByCategorySlug:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountByDetailSlug = async (req, res) => {
  try {
    const { slugDetail } = req.params;

    // 1. tìm account theo slug_detail
    const account = await AccountDetail.findOne({
      slug_detail: slugDetail,
      status: true,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    // 2. lấy category tương ứng
    const category = await AccountCategory.findById(account.category_id);

    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    return res.status(200).json({
      message: "Lấy chi tiết account thành công",
      category: {
        id: category._id,
        name: category.name_category,
        slug: category.slug_category,
        attributes: category.attributes_category,
      },
      data: account,
    });
  } catch (error) {
    console.error("Lỗi readAccountByDetailSlug:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
