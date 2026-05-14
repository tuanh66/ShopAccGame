import AccountsHistory from "../models/AccountsHistory.js";
import RandomAccountsHistory from "../models/RandomAccountsHistory.js";
import mongoose from "mongoose";
import Categories from "../models/Categories.js";
import Accounts from "../models/Accounts.js";
import RandomCategories from "../models/RandomCategories.js";
import RandomAccounts from "../models/RandomAccounts.js";
import Users from "../models/User.js";
import UserHistory from "../models/UserHistory.js";
import DiscountCode from "../models/DiscountCode.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";
import { encrypt, decrypt } from "../libs/encryption.js";

// Admin
// Accounts
export const createAccounts = async (req, res) => {
  try {
    const {
      categories_id,
      username,
      password,
      price,
      price_sale = 0,
      avatar,
      image = [],
      attributes = {},
      status = true,
    } = req.body;

    // 2️⃣ kiểm tra category
    const categories = await Categories.findById(categories_id);
    if (!categories) {
      return res.status(404).json({
        message: "Categories không tồn tại",
      });
    }

    if (!username || !password || !avatar) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const categoriesAttributes = categories.attributes || {};
    // 3️⃣ validate attributes
    for (const [key, value] of Object.entries(attributes)) {
      const attr = categoriesAttributes[key];

      if (!attr) {
        return res.status(400).json({
          message: `Thuộc tính ${key} không tồn tại`,
        });
      }

      if (value === "" || value === null || value === undefined) continue;

      if (attr.type === "number") {
        const num = Number(value);

        if (isNaN(num)) {
          return res.status(400).json({
            message: `${attr.label} phải là số`,
          });
        }

        attributes[key] = num;
      }

      if (attr.type === "select") {
        if (!attr.options.includes(value)) {
          return res.status(400).json({
            message: `Giá trị không hợp lệ cho ${attr.label}`,
          });
        }
      }
    }
    // 5️⃣ tạo account detail
    const accounts = await Accounts.create({
      categories_id,
      username,
      password,
      price,
      price_sale,
      avatar,
      image,
      attributes,
      status,
    });

    return res.status(201).json({
      message: "Tạo accounts thành công",
      data: accounts,
    });
  } catch (error) {
    if (error.code === 11000) {
      const user = error.keyValue?.username;
      return res.status(409).json({
        message: `Tài khoản ${user} đã tồn tại trong danh mục này`,
      });
    }

    console.error("Lỗi khi gọi createAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountsAttributeBySlugCategories = async (req, res) => {
  try {
    const { slugCategoriesAttribute } = req.params;

    const categories = await Categories.findOne({
      slug: slugCategoriesAttribute,
    }).select("attributes name slug");

    if (!categories) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    return res.status(200).json({
      message: "Lấy attributes thành công",
      attributes: categories.attributes,
      category: {
        id: categories._id,
        name: categories.name,
        slug: categories.slug,
      },
    });
  } catch (error) {
    console.error("Lỗi readAccountsAttributeBySlugCategories:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const readAccounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    const slugCategory = req.params.slugCategories;
    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [{ username: searchRegex }];

      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ accountsId: num });
        filter.$or.push({ price: num });
        filter.$or.push({ price_sale: num });
      }
    }

    if (slugCategory) {
      const category = await Categories.findOne({
        slug: slugCategory,
      });
      if (!category) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }
      filter.categories_id = category._id;
    }

    const total = await Accounts.countDocuments(filter);
    const accounts = await Accounts.find(filter)
      .select("-__v -_id -password -categories_id -buyer -image -attributes -updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedAccounts = accounts.map((item) => {
      const doc = item.toObject();
      const final_price = doc.price_sale > 0 ? doc.price_sale : doc.price;
      return {
        ...doc,
        final_price,
        price: undefined,
        price_sale: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy danh sách account thành công",
      data: formattedAccounts,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountsById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Accounts.findOne({ accountsId: id });

    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    const categories = await Categories.findById(account.categories_id);

    return res.status(200).json({
      message: "Lấy chi tiết account thành công",
      categories: {
        id: categories._id,
        name: categories.name,
        slug: categories.slug,
        attributes: categories.attributes,
      },
      accounts: account,
    });
  } catch (error) {
    console.error("Lỗi readAccountDetailById:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateAccounts = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      username,
      password,
      price,
      price_sale,
      avatar,
      image,
      attributes,
      status,
    } = req.body;

    // tìm account
    const account = await Accounts.findOne({ accountsId: id });

    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    // update field cơ bản
    if (username !== undefined) account.username = username;
    if (password !== undefined) account.password = password;
    if (price !== undefined) account.price = price;
    if (price_sale !== undefined) account.price_sale = price_sale;
    if (avatar !== undefined) account.avatar = avatar;
    if (image !== undefined) account.image = image;
    if (status !== undefined) account.status = status;

    // validate attributes
    if (attributes) {
      const category = await Categories.findById(account.categories_id);

      if (!category) {
        return res.status(404).json({
          message: "Danh mục không tồn tại",
        });
      }

      const categoryAttributes = category.attributes || {};

      for (const [key, value] of Object.entries(attributes)) {
        const config = categoryAttributes[key];

        if (!config) {
          return res.status(400).json({
            message: `Thuộc tính ${key} không tồn tại`,
          });
        }

        // cho phép rỗng
        if (value === "" || value === null || value === undefined) {
          continue;
        }

        if (config.type === "select") {
          if (!config.options.includes(value)) {
            return res.status(400).json({
              message: `Giá trị không hợp lệ cho ${config.label}`,
            });
          }
        }

        if (config.type === "number") {
          const numberValue = Number(value);

          if (isNaN(numberValue)) {
            return res.status(400).json({
              message: `${config.label} phải là số`,
            });
          }

          // convert luôn thành number
          attributes[key] = numberValue;
        }
      }

      account.attributes = {
        ...account.attributes,
        ...attributes,
      };

      account.markModified("attributes");
    }

    await account.save();

    return res.status(200).json({
      message: "Cập nhật account thành công",
      data: account,
    });
  } catch (error) {
    if (error.code === 11000) {
      const user = error.keyValue?.username;

      return res.status(409).json({
        message: `Tài khoản ${user} đã tồn tại`,
      });
    }

    console.error("Lỗi khi gọi updateAccounts:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const deleteAccounts = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Accounts.findOneAndDelete({ accountsId: id });

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
    console.error("Lỗi khi gọi deleteAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Random Accounts
export const createRandomAccounts = async (req, res) => {
  try {
    const {
      randomCategories_id,
      categorySlug,
      username,
      password,
      tier,
      image,
    } = req.body;

    let categoryId = randomCategories_id;

    // Nếu không có ID nhưng có slug thì đi tìm ID từ slug
    if (!categoryId && categorySlug) {
      const category = await RandomCategories.findOne({ slug: categorySlug });
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      categoryId = category._id;
    }

    if (!categoryId || !username || !password || !tier) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const newAccount = new RandomAccounts({
      randomCategories_id: categoryId,
      username,
      password: encrypt(password),
      tier,
      image: image || [],
    });

    await newAccount.save();

    return res.status(201).json({
      message: "Tạo tài khoản random thành công",
      data: newAccount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createRandomAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readRandomAccounts = async (req, res) => {
  try {
    const { slug } = req.params;

    let query = {};
    if (slug) {
      const category = await RandomCategories.findOne({ slug });
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      query.randomCategories_id = category._id;
    }

    const accounts = await RandomAccounts.find(query)
      .populate("randomCategories_id", "name")
      .sort({ createdAt: -1 });

    const decryptedAccounts = accounts.map((acc) => ({
      ...acc.toObject(),
      password: decrypt(acc.password),
    }));

    return res.status(200).json({
      message: "Lấy danh sách tài khoản random thành công",
      data: decryptedAccounts,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readRandomAccountsById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await RandomAccounts.findOne({ randomAccountsId: id });

    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const decryptedAccount = {
      ...account.toObject(),
      password: decrypt(account.password),
    };

    return res.status(200).json({
      message: "Lấy thông tin tài khoản random thành công",
      data: decryptedAccount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomAccountsById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateRandomAccounts = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, tier, image, status } = req.body;

    const account = await RandomAccounts.findOneAndUpdate(
      { randomAccountsId: id },
      {
        username,
        password: encrypt(password),
        tier,
        image,
        status,
      },
      { new: true },
    );

    if (!account) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản để cập nhật" });
    }

    return res.status(200).json({
      message: "Cập nhật tài khoản random thành công",
      data: account,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateRandomAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteRandomAccounts = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await RandomAccounts.findOneAndDelete({
      randomAccountsId: id,
    });
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    return res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi deleteRandomAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Client
export const readCategoriesAccountStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const { sort, find, id_data, price_data, ...restQuery } = req.query;

    // 1. Tìm categories
    const categories = await Categories.findOne({ slug, status: true }).select(
      "name slug attributes",
    );

    if (!categories) {
      // Thử tìm trong danh mục Random
      const randomCategory = await RandomCategories.findOne({
        slug,
        status: true,
      });
      if (!randomCategory) {
        return res.status(404).json({
          message: "Danh mục không tồn tại",
        });
      }

      // Lấy danh sách tài khoản random chưa bán
      const accounts = await RandomAccounts.find({
        randomCategories_id: randomCategory._id,
        status: false,
      });

      const stock = {
        thuong: accounts.filter((a) => a.tier === "thuong").length,
        ngon: accounts.filter((a) => a.tier === "ngon").length,
        sieuPham: accounts.filter((a) => a.tier === "sieuPham").length,
        total: accounts.length,
      };

      const samples = accounts.slice(0, 12).map((acc) => ({
        accountsId: acc.randomAccountsId,
        tier: acc.tier,
        image: acc.image,
        price: randomCategory.price,
        status: acc.status,
      }));

      return res.status(200).json({
        message: "Lấy thông tin danh mục random thành công",
        category: randomCategory,
        stock,
        accounts: samples,
        isRandom: true,
      });
    }

    // 2. query base
    const matchQuery = {
      categories_id: categories._id,
      status: false,
    };

    // ===== 🔍 SEARCH NOTE (find) =====
    if (find) {
      const keywords = find
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);

      if (keywords.length > 0) {
        matchQuery.$or = keywords.map((kw) => ({
          note: { $regex: kw, $options: "i" },
        }));
      }
    }

    // ===== 🔍 SEARCH ID =====
    if (id_data && mongoose.Types.ObjectId.isValid(id_data)) {
      matchQuery._id = new mongoose.Types.ObjectId(id_data);

      delete matchQuery.$or;
    }

    // ===== 💰 SEARCH PRICE =====
    if (price_data && price_data !== "0") {
      let priceCondition = {};

      if (price_data.includes("-")) {
        const [min, max] = price_data.split("-");
        priceCondition = { $gte: +min, $lte: +max };
      } else {
        priceCondition = { $gte: +price_data };
      }

      matchQuery.$expr = {
        $and: [
          {
            $gte: [
              {
                $cond: [{ $gt: ["$price_sale", 0] }, "$price_sale", "$price"],
              },
              priceCondition.$gte || 0,
            ],
          },
          ...(priceCondition.$lte
            ? [
                {
                  $lte: [
                    {
                      $cond: [
                        { $gt: ["$price_sale", 0] },
                        "$price_sale",
                        "$price",
                      ],
                    },
                    priceCondition.$lte,
                  ],
                },
              ]
            : []),
        ],
      };
    }

    // ===== 🎯 SEARCH ATTRIBUTES (dynamic select) =====
    Object.entries(restQuery).forEach(([key, value]) => {
      if (value && value !== "0") {
        const attrConfig = categories.attributes?.[key];

        if (attrConfig?.type === "select") {
          const found = attrConfig.options?.find((opt) => {
            const slug = opt
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/Đ/g, "D")
              .toLowerCase()
              .replace(/\s+/g, "_");

            return slug === value;
          });

          if (found) {
            matchQuery[`attributes.${key}`] = found; // ✅ dùng value gốc DB
          }
        } else {
          matchQuery[`attributes.${key}`] = value;
        }
      }
    });

    let accounts = [];
    const sortValue = Array.isArray(sort) ? sort[0] : sort;
    // ===== 🔀 SORT =====
    if (!sortValue || sortValue === "random") {
      // 👉 RANDOM nhưng vẫn giữ filter
      accounts = await Accounts.aggregate([
        { $match: matchQuery },

        {
          $addFields: {
            final_price: {
              $cond: [{ $gt: ["$price_sale", 0] }, "$price_sale", "$price"],
            },
          },
        },

        ...(sortValue === "random"
          ? [{ $sample: { size: 100 } }] // ✅ random trước
          : []),

        ...(sortValue !== "random"
          ? [{ $sort: sortStage }] // ✅ chỉ sort khi KHÔNG random
          : []),

        {
          $project: {
            _id: 0,
            username: 0,
            password: 0,
            image: 0,
            status: 0,
            buyer: 0,
            categories_id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ]);
    } else {
      let sortStage = { createdAt: -1 };

      switch (sortValue) {
        case "price_desc":
          sortStage = { final_price: -1 };
          break;
        case "price_asc":
          sortStage = { final_price: 1 };
          break;
        case "newest":
          sortStage = { createdAt: -1 };
          break;
        case "oldest":
          sortStage = { createdAt: 1 };
          break;
      }

      accounts = await Accounts.aggregate([
        { $match: matchQuery },

        {
          $addFields: {
            final_price: {
              $cond: [{ $gt: ["$price_sale", 0] }, "$price_sale", "$price"],
            },
          },
        },

        { $sort: sortStage },

        ...(sortValue === "random" ? [{ $sample: { size: 100 } }] : []),

        {
          $project: {
            username: 0,
            password: 0,
            image: 0,
            status: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ]);
    }

    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      categories: {
        name: categories.name,
        slug: categories.slug,
        attributes: categories.attributes,
      },
      accounts,
      total: accounts.length,
      isRandom: false,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCategoryAccountStatus", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readCategoriesAccountId = async (req, res) => {
  try {
    const { slug, id } = req.params;

    // 1. Tìm category
    const category = await Categories.findOne({
      slug,
      status: true,
    }).select("_id name slug attributes");

    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // 3. Tìm account theo accountsId + category
    const account = await Accounts.findOne({
      accountsId: id,
      categories_id: category._id,
      status: false,
    }).select(
      "-username -password -__v -_id -avatar -buyer -categories_id -createdAt -updatedAt -status",
    );

    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    // 4. Tìm tài khoản liên quan (Gộp logic từ readCategoriesAccountRelate)
    const basePrice =
      account.price_sale > 0 ? account.price_sale : account.price;

    let relatedAccounts = await Accounts.aggregate([
      {
        $match: {
          categories_id: category._id,
          status: false,
          accountsId: { $ne: account.accountsId },
        },
      },
      {
        $addFields: {
          final_price: {
            $cond: [{ $gt: ["$price_sale", 0] }, "$price_sale", "$price"],
          },
        },
      },
      {
        $match: {
          final_price: {
            $gte: basePrice * 0.5,
            $lte: basePrice * 1.5,
          },
        },
      },
      { $sample: { size: 10 } },
    ]);

    // Nếu không đủ 10 acc liên quan, lấy thêm random cùng danh mục
    if (relatedAccounts.length < 10) {
      const remain = 10 - relatedAccounts.length;
      const excludeIds = relatedAccounts.map((acc) => acc.accountsId);
      excludeIds.push(account.accountsId);

      const moreAccounts = await Accounts.aggregate([
        {
          $match: {
            categories_id: category._id,
            status: false,
            accountsId: { $nin: excludeIds },
          },
        },
        { $sample: { size: remain } },
      ]);
      relatedAccounts = [...relatedAccounts, ...moreAccounts];
    }

    // Làm đẹp dữ liệu cho cả account chính và account liên quan
    const enrichAttributes = (attrs) =>
      Object.entries(attrs || {}).map(([key, value]) => {
        const config = category.attributes?.[key];
        return { label: config?.label || key, value };
      });

    const enrichedRelated = relatedAccounts.map((acc) => ({
      accountsId: acc.accountsId,
      price: acc.price,
      price_sale: acc.price_sale,
      avatar: acc.avatar,
      attributes: enrichAttributes(acc.attributes),
    }));

    // 5. Trả về toàn bộ dữ liệu
    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      category: {
        name: category.name,
        slug: category.slug,
      },
      account: {
        ...account.toObject(),
        attributes: enrichAttributes(account.attributes),
      },
      related: enrichedRelated, // Trả thêm mảng liên quan
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCategoriesAccountId", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const buyAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const accountId = req.params.id;
    const userId = req.user._id;
    const { discountCode: discountCodeInput } = req.body;

    const user = await Users.findById(userId).session(session);
    if (!user) throw new Error("Không tìm thấy user");

    const account = await Accounts.findOne({
      accountsId: accountId,
      status: false,
    }).session(session);

    if (!account) {
      throw new Error("Account đã được mua hoặc không tồn tại");
    }

    const originalPrice =
      account.price_sale > 0 ? account.price_sale : account.price;

    // Xử lý mã giảm giá nếu có
    let discountAmount = 0;
    let appliedDiscount = null;

    if (discountCodeInput) {
      const discount = await DiscountCode.findOne({
        code: discountCodeInput.trim().toUpperCase(),
        status: true,
      }).session(session);

      if (!discount) throw new Error("Mã giảm giá không hợp lệ");

      // Check hết hạn
      if (
        discount.expirationDate &&
        new Date() > new Date(discount.expirationDate)
      ) {
        throw new Error("Mã giảm giá đã hết hạn");
      }

      // Check lượt dùng toàn hệ thống
      if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
        throw new Error("Mã giảm giá đã hết lượt sử dụng");
      }

      // Check lượt dùng của user
      const userUsageCount = await DiscountCodeHistory.countDocuments({
        user: userId,
        code: discount.code,
      }).session(session);
      if (
        discount.maxUsesPerUser > 0 &&
        userUsageCount >= discount.maxUsesPerUser
      ) {
        throw new Error("Bạn đã sử dụng hết lượt dùng mã này");
      }

      // Check đơn tối thiểu
      if (
        discount.minOrderValue > 0 &&
        originalPrice < discount.minOrderValue
      ) {
        throw new Error("Đơn hàng chưa đạt giá trị tối thiểu");
      }

      // Check applyTo
      if (discount.applyTo !== "all" && discount.applyTo !== "account") {
        throw new Error("Mã giảm giá không áp dụng cho sản phẩm này");
      }

      // Tính giảm
      if (discount.type === "percent") {
        discountAmount = Math.floor((originalPrice * discount.value) / 100);
        if (discount.maxDiscount > 0 && discountAmount > discount.maxDiscount) {
          discountAmount = discount.maxDiscount;
        }
      } else {
        discountAmount = discount.value;
      }
      if (discountAmount > originalPrice) discountAmount = originalPrice;

      appliedDiscount = discount;

      // Tăng usedCount
      discount.usedCount += 1;
      await discount.save({ session });

      // Ghi lịch sử mã giảm giá
      await DiscountCodeHistory.create(
        [
          {
            user: userId,
            code: discount.code,
            type: discount.type,
            applyFor: discount.applyTo,
            originalPrice,
            discountAmount,
            finalPrice: originalPrice - discountAmount,
          },
        ],
        { session },
      );
    }

    const finalPrice = originalPrice - discountAmount;

    if (user.balance < finalPrice) {
      throw new Error("Không đủ tiền");
    }

    const balance_before = user.balance;

    user.balance -= finalPrice;
    await user.save({ session });

    account.status = true;
    account.buyer = userId;
    await account.save({ session });

    // Ghi lịch sử mua account vào UserHistory (Lịch sử biến động số dư)
    await UserHistory.create(
      [
        {
          userId,
          transaction: "buyAccount",
          amount: finalPrice,
          balance_before,
          balance_after: user.balance,
          description: appliedDiscount
            ? `Trừ tiền mua acc #${account.accountsId} (giảm ${discountAmount.toLocaleString()}đ với mã ${appliedDiscount.code})`
            : `Trừ tiền mua acc #${account.accountsId}`,
        },
      ],
      { session },
    );

    // Ghi lịch sử mua account vào AccountsHistory (Lịch sử sở hữu nick)
    await AccountsHistory.create(
      [
        {
          userId,
          accountId: account._id,
          categoriesId: account.categories_id,
          price: finalPrice,
          status: true,
        },
      ],
      { session },
    );

    // Ghi lịch sử sử dụng mã giảm giá vào UserHistory
    if (appliedDiscount) {
      await UserHistory.create(
        [
          {
            userId,
            transaction: "discountCode",
            amount: discountAmount,
            balance_before,
            balance_after: user.balance,
            description: `Sử dụng mã giảm giá ${appliedDiscount.code} - Giảm ${discountAmount.toLocaleString()}đ cho account ${account._id}`,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Mua thành công",
      data: {
        discountAmount,
        finalPrice,
        originalPrice,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ message: error.message });
  }
};

export const readRandomAccountsStatus = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Tìm danh mục Random
    const category = await RandomCategories.findOne({ slug, status: true });
    if (!category) {
      return res.status(404).json({ message: "Danh mục random không tồn tại" });
    }

    // 2. Thống kê số lượng tồn kho theo từng Tier
    // Lấy tất cả tài khoản chưa bán thuộc danh mục này
    const accounts = await RandomAccounts.find({
      randomCategories_id: category._id,
      status: false,
    });

    const stock = {
      thuong: accounts.filter((a) => a.tier === "thuong").length,
      ngon: accounts.filter((a) => a.tier === "ngon").length,
      sieuPham: accounts.filter((a) => a.tier === "sieuPham").length,
      total: accounts.length,
    };

    const samples = accounts.slice(0, 12).map((acc) => ({
      accountsId: acc.randomAccountsId,
      tier: acc.tier,
      image: acc.image,
      price: category.price,
      status: acc.status,
    }));

    return res.status(200).json({
      message: "Lấy thông tin danh mục random thành công",
      category,
      stock,
      accounts: samples,
      total: accounts.length,
      isRandom: true,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomAccountsStatus", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const buyRandomAccounts = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const categoryIdOrSlug = req.params.id;
    const userId = req.user._id;
    const { discountCode: discountCodeInput } = req.body;

    const user = await Users.findById(userId).session(session);
    if (!user) throw new Error("Không tìm thấy user");

    // Tìm danh mục thử vận may hỗ trợ linh hoạt cả ObjectId, chuỗi ID hoặc Slug
    const categoryQuery = mongoose.isValidObjectId(categoryIdOrSlug)
      ? { _id: categoryIdOrSlug, status: true }
      : {
          $or: [
            { slug: categoryIdOrSlug },
            {
              randomCategoriesId: !isNaN(categoryIdOrSlug)
                ? Number(categoryIdOrSlug)
                : -1,
            },
          ],
          status: true,
        };

    const category =
      await RandomCategories.findOne(categoryQuery).session(session);
    if (!category) {
      throw new Error("Danh mục thử vận may không tồn tại hoặc đã bị ẩn");
    }

    // Lấy danh sách tài khoản random chưa bán thuộc danh mục này
    const availableAccounts = await RandomAccounts.find({
      randomCategories_id: category._id,
      status: false,
    }).session(session);

    if (availableAccounts.length === 0) {
      throw new Error(
        "Danh mục này hiện đã hết tài khoản, vui lòng quay lại sau",
      );
    }

    const originalPrice =
      category.priceSale > 0 ? category.priceSale : category.price;

    // Xử lý mã giảm giá nếu có
    let discountAmount = 0;
    let appliedDiscount = null;

    if (discountCodeInput) {
      const discount = await DiscountCode.findOne({
        code: discountCodeInput.trim().toUpperCase(),
        status: true,
      }).session(session);

      if (!discount) throw new Error("Mã giảm giá không hợp lệ");

      // Check hết hạn
      if (
        discount.expirationDate &&
        new Date() > new Date(discount.expirationDate)
      ) {
        throw new Error("Mã giảm giá đã hết hạn");
      }

      // Check lượt dùng toàn hệ thống
      if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
        throw new Error("Mã giảm giá đã hết lượt sử dụng");
      }

      // Check lượt dùng của user
      const userUsageCount = await DiscountCodeHistory.countDocuments({
        user: userId,
        code: discount.code,
      }).session(session);
      if (
        discount.maxUsesPerUser > 0 &&
        userUsageCount >= discount.maxUsesPerUser
      ) {
        throw new Error("Bạn đã sử dụng hết lượt dùng mã này");
      }

      // Check đơn tối thiểu
      if (
        discount.minOrderValue > 0 &&
        originalPrice < discount.minOrderValue
      ) {
        throw new Error("Đơn hàng chưa đạt giá trị tối thiểu");
      }

      // Check applyTo (chấp nhận all hoặc account)
      if (discount.applyTo !== "all" && discount.applyTo !== "account") {
        throw new Error("Mã giảm giá không áp dụng cho sản phẩm này");
      }

      // Tính số tiền giảm
      if (discount.type === "percent") {
        discountAmount = Math.floor((originalPrice * discount.value) / 100);
        if (discount.maxDiscount > 0 && discountAmount > discount.maxDiscount) {
          discountAmount = discount.maxDiscount;
        }
      } else {
        discountAmount = discount.value;
      }
      if (discountAmount > originalPrice) discountAmount = originalPrice;

      appliedDiscount = discount;

      // Tăng số lượt sử dụng
      discount.usedCount += 1;
      await discount.save({ session });

      // Ghi lịch sử sử dụng mã giảm giá
      await DiscountCodeHistory.create(
        [
          {
            user: userId,
            code: discount.code,
            type: discount.type,
            applyFor: discount.applyTo,
            originalPrice,
            discountAmount,
            finalPrice: originalPrice - discountAmount,
          },
        ],
        { session },
      );
    }

    const finalPrice = originalPrice - discountAmount;

    if (user.balance < finalPrice) {
      throw new Error(
        "Tài khoản của bạn không đủ số dư để thực hiện giao dịch",
      );
    }

    // THUẬT TOÁN QUAY XÁC SUẤT (CHANCE) DỰA VÀO CẤU HÌNH RANDOM CATEGORIES
    const r = Math.random() * 100;
    const chanceThuong = category.chance?.thuong ?? 80;
    const chanceNgon = category.chance?.ngon ?? 15;
    const chanceSieuPham = category.chance?.sieuPham ?? 5;

    let targetTier = "thuong";
    if (r < chanceSieuPham) {
      targetTier = "sieuPham";
    } else if (r < chanceSieuPham + chanceNgon) {
      targetTier = "ngon";
    } else {
      targetTier = "thuong";
    }

    // Lọc các nick chưa bán thuộc Tier quay trúng
    let pool = availableAccounts.filter((a) => a.tier === targetTier);

    // Fallback cực kỳ an toàn: Nếu Tier quay trúng đã hết tài khoản, lấy ngẫu nhiên từ toàn bộ kho còn lại
    if (pool.length === 0) {
      pool = availableAccounts;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedAccount = pool[randomIndex];

    const balance_before = user.balance;
    user.balance -= finalPrice;
    await user.save({ session });

    // Đánh dấu tài khoản đã được mua
    selectedAccount.status = true;
    selectedAccount.buyer = userId;
    await selectedAccount.save({ session });

    // Ghi lịch sử trừ tiền vào UserHistory
    await UserHistory.create(
      [
        {
          userId,
          transaction: "buyAccount",
          amount: finalPrice,
          balance_before,
          balance_after: user.balance,
          description: appliedDiscount
            ? `Mua hòm thử vận may ${category.name} (giảm ${discountAmount.toLocaleString()}đ với mã ${appliedDiscount.code})`
            : `Mua hòm thử vận may ${category.name} (#${selectedAccount.randomAccountsId})`,
        },
      ],
      { session },
    );

    // Ghi lịch sử sở hữu nick ngẫu nhiên vào RandomAccountsHistory
    await RandomAccountsHistory.create(
      [
        {
          userId,
          accountId: selectedAccount._id,
          categoriesId: category._id,
          tier: selectedAccount.tier,
          price: finalPrice,
          passwordStatus: false,
          status: true,
        },
      ],
      { session },
    );

    // Ghi lịch sử dùng mã giảm giá vào UserHistory nếu có
    if (appliedDiscount) {
      await UserHistory.create(
        [
          {
            userId,
            transaction: "discountCode",
            amount: discountAmount,
            balance_before,
            balance_after: user.balance,
            description: `Sử dụng mã giảm giá ${appliedDiscount.code} - Giảm ${discountAmount.toLocaleString()}đ khi mua hòm ${category.name}`,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Mua tài khoản thử vận may thành công",
      data: {
        account: {
          randomAccountsId: selectedAccount.randomAccountsId,
          username: selectedAccount.username,
          password: selectedAccount.password,
          tier: selectedAccount.tier,
        },
        discountAmount,
        finalPrice,
        originalPrice,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Lỗi khi gọi buyRandomAccounts", error);
    return res.status(400).json({ message: error.message || "Lỗi hệ thống" });
  }
};
