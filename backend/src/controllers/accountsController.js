import mongoose from "mongoose";
import Categories from "../models/Categories.js";
import Accounts from "../models/Accounts.js";
import Users from "../models/User.js";
import UserHistory from "../models/UserHistory.js";

// Admin
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
    const slugCategory = req.params.slugCategories;
    const filter = {};

    if (slugCategory) {
      const category = await Categories.findOne({
        slug: slugCategory,
      });
      if (!category) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }
      filter.categories_id = category._id;
    }

    if (search) {
      filter.username = { $regex: search, $options: "i" };
    }

    const total = await Accounts.countDocuments(filter);

    const accounts = await Accounts.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: "Lấy danh sách account thành công",

      data: accounts,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccountDetail", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountsById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Accounts.findById(id);

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
    const account = await Accounts.findById(id);

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

    const account = await Accounts.findByIdAndDelete(id);

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
      return res.status(404).json({
        message: "Danh mục không tồn tại",
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
            username: 0,
            password: 0,
            image: 0,
            status: 0,
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

    // 2. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    // 3. Tìm account theo ID + category
    const account = await Accounts.findOne({
      _id: id,
      categories_id: category._id,
      status: false,
    }).select("-username -password -__v");

    if (!account) {
      return res.status(404).json({
        message: "Account không tồn tại",
      });
    }

    // 4. Trả về
    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      category: {
        name: category.name,
        slug: category.slug,
        attributes: category.attributes,
      },
      account,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCategoriesAccountId", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readCategoriesAccountRelate = async (req, res) => {
  try {
    const { slug, id } = req.params;

    // 1. Tìm category
    const category = await Categories.findOne({
      slug,
      status: true,
    }).select("_id");

    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // 2. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    // 3. account hiện tại
    const currentAccount =
      await Accounts.findById(id).select("price price_sale");

    const basePrice =
      currentAccount?.price_sale > 0
        ? currentAccount.price_sale
        : currentAccount?.price || 0;

    let relatedAccounts = [];

    // ===== 4. LẤY ACC GẦN GIÁ =====
    if (basePrice > 0) {
      relatedAccounts = await Accounts.aggregate([
        {
          $match: {
            categories_id: category._id,
            status: false,
            _id: { $ne: new mongoose.Types.ObjectId(id) },
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
    }

    // ===== 5. NẾU CHƯA ĐỦ → BÙ RANDOM =====
    if (relatedAccounts.length < 10) {
      const remain = 10 - relatedAccounts.length;

      const excludeIds = relatedAccounts.map((acc) => acc._id);
      excludeIds.push(new mongoose.Types.ObjectId(id));

      const moreAccounts = await Accounts.aggregate([
        {
          $match: {
            categories_id: category._id,
            status: false,
            _id: { $nin: excludeIds }, // ❌ tránh trùng
          },
        },
        { $sample: { size: remain } },
      ]);

      relatedAccounts = [...relatedAccounts, ...moreAccounts];
    }

    // ===== 6. ẨN FIELD =====
    const finalAccounts = relatedAccounts.map((acc) => {
      const { username, password, __v, ...rest } = acc;
      return rest;
    });

    return res.status(200).json({
      message: "Lấy acc liên quan thành công",
      accounts: finalAccounts,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCategoriesAccountRelate", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const buyAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const accountId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      throw new Error("accountId không hợp lệ");
    }

    const user = await Users.findById(userId).session(session);
    if (!user) throw new Error("Không tìm thấy user");

    const account = await Accounts.findOne({
      _id: accountId,
      status: false,
    }).session(session);

    if (!account) {
      throw new Error("Account đã được mua hoặc không tồn tại");
    }

    const finalPrice =
      account.price_sale > 0 ? account.price_sale : account.price;

    if (user.balance < finalPrice) {
      throw new Error("Không đủ tiền");
    }

    const balance_before = user.balance;

    user.balance -= finalPrice;
    await user.save({ session });

    account.status = true;
    account.buyer = userId;
    await account.save({ session });

    await UserHistory.create(
      [
        {
          userId,
          transaction: "buyAccount",
          amount: finalPrice,
          balance_before,
          balance_after: user.balance,
          description: `Mua account ${account._id}`,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "Mua thành công" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ message: error.message });
  }
};
