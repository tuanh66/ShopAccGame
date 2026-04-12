import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import uploadImage from "../../assets/svg/upload.svg";
import selectedPhotos from "../../assets/img/selectedPhotos.png";

const AccountsCreate = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [categoryId, setCategoryId] = useState(null);
  const [accountsCreate, setAccountsCreate] = useState({
    username: "",
    password: "",
    price: "",
    avatar: "",
    image: [],
    status: false,
  });
  const { slugCategories } = useParams();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [detailPreview, setDetailPreview] = useState([]);
  const [detailFiles, setDetailFiles] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [attributeValues, setAttributeValues] = useState({});

  const handleAvatarCreate = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file); // lưu file
    setAvatarPreview(URL.createObjectURL(file)); // preview
  };

  const handleDetailImagesCreate = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setDetailFiles(files); // lưu file

    setDetailPreview(files.map((file) => URL.createObjectURL(file)));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/accounts/admin/attributes/${slugCategories}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const attrs = res.data.attributes;

        setCategoryId(res.data.category.id);
        setAttributes(attrs);

        const defaultValues = {};

        Object.keys(attrs).forEach((key) => {
          defaultValues[key] = "";
        });

        setAttributeValues(defaultValues);
      } catch (error) {
        console.error("Lỗi lấy attributes", error);
      }
    };

    fetchCategory();
  }, [slugCategories]);

  const handleAttributeChange = (key, value) => {
    setAttributeValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [accountError, setAccountError] = useState({});
  const validateAccountField = (field, value) => {
    let message = "";

    switch (field) {
      case "username":
        if (!value.trim()) message = "Chưa nhập tên tài khoản";
        break;

      case "password":
        if (!value.trim()) message = "Chưa nhập mật khẩu";
        break;

      case "price":
        if (!value.trim()) message = "Chưa nhập giá";
        break;

      case "avatar":
        if (!value) message = "Chưa chọn ảnh đại diện";
        break;

      case "image":
        if (!value || value.length === 0) message = "Chưa chọn ảnh chi tiết";
        break;
    }
    setAccountError((prev) => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // chạy validate tất cả field
    validateAccountField("username", accountsCreate.username);
    validateAccountField("password", accountsCreate.password);
    validateAccountField("price", accountsCreate.price);
    validateAccountField("avatar", avatarFile);
    validateAccountField("image", detailFiles);

    // check nếu có lỗi thì dừng
    if (
      !accountsCreate.username.trim() ||
      !accountsCreate.password.trim() ||
      !accountsCreate.price ||
      !avatarFile ||
      detailFiles.length === 0
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      let avatarUrl = "";
      let detailUrls = [];

      // upload avatar
      if (avatarFile) {
        avatarUrl = await uploadImageToImgbb(avatarFile);
      }

      // upload ảnh chi tiết
      if (detailFiles.length > 0) {
        detailUrls = await Promise.all(
          detailFiles.map((file) => uploadImageToImgbb(file)),
        );
      }

      const res = await axios.post(
        "http://localhost:5001/api/accounts/admin",
        {
          categories_id: categoryId,
          username: accountsCreate.username,
          password: accountsCreate.password,
          price: Number(accountsCreate.price),
          avatar: avatarUrl,
          image: detailUrls,
          attributes: attributeValues,
          status: accountsCreate.status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      toast.success(res.data.message);

      setAccountsCreate({
        username: "",
        password: "",
        price: "",
        avatar: "",
        image: [],
        status: true,
      });

      setAvatarPreview(null);
      setDetailPreview([]);
      setAvatarFile(null);
      setDetailFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Tạo account thất bại");
    }
  };

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      "https://api.imgbb.com/1/upload?key=6624e532541b0b39305d1b01b8e065cd",
      formData,
    );

    return res.data.data.url;
  };
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Thêm tài khoản acc game</h4>
          <span>Nhập thông tin tài khoản</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-accounts" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="username">
                  Tài khoản
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Nhập tên tài khoản"
                  className={`input-form ${accountError.username ? "input-error" : ""}`}
                  value={accountsCreate.username}
                  onChange={(e) =>
                    setAccountsCreate({
                      ...accountsCreate,
                      username: e.target.value,
                    })
                  }
                />
                <p className="form-message-error">{accountError.username}</p>
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="password">
                  Mật khẩu
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Nhập tên mật khẩu"
                  className={`input-form ${accountError.password ? "input-error" : ""}`}
                  value={accountsCreate.password}
                  onChange={(e) =>
                    setAccountsCreate({
                      ...accountsCreate,
                      password: e.target.value,
                    })
                  }
                />
                <p className="form-message-error">{accountError.password}</p>
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="priceAccount">
                  Giá tiền
                  <span>*</span>
                </label>
                <input
                  type="number"
                  name="priceAccount"
                  id="priceAccount"
                  placeholder="Nhập giá tiền"
                  className={`input-form ${accountError.price ? "input-error" : ""}`}
                  value={accountsCreate.price}
                  onChange={(e) =>
                    setAccountsCreate({
                      ...accountsCreate,
                      price: e.target.value,
                    })
                  }
                />
                <p className="form-message-error">{accountError.price}</p>
              </div>
              {attributes &&
                Object.entries(attributes).map(([key, attr]) => (
                  <div
                    className="col-lg-6 col-sm-6 col-12 form-group"
                    key={key}
                  >
                    <label htmlFor={key}>
                      {attr.label}
                      <span>*</span>
                    </label>

                    {attr.type === "select" ? (
                      <select
                        className="select-form"
                        value={attributeValues[key]}
                        onChange={(e) =>
                          handleAttributeChange(key, e.target.value)
                        }
                      >
                        <option value="">Chọn {attr.label}</option>
                        {attr.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={attr.type}
                        id={key}
                        name={key}
                        className="input-form"
                        value={attributeValues[key]}
                        onChange={(e) =>
                          handleAttributeChange(key, e.target.value)
                        }
                        placeholder={`Nhập ${attr.label}`}
                      />
                    )}
                  </div>
                ))}
              <div className="col-lg-12 form-group">
                <label>
                  Ảnh đại diện<span>*</span>
                </label>
                <div className="image-upload">
                  <input
                    type="file"
                    name=""
                    id="uploadAvatar"
                    accept="image/*"
                    onChange={handleAvatarCreate}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn ảnh để tải lên</span>
                  </div>
                </div>
                <p className="form-message-error">{accountError.avatar}</p>
              </div>
              <div className="col-lg-12 form-group">
                <label>
                  Ảnh chi tiết<span>*</span>
                </label>
                <div className="image-upload">
                  <input
                    type="file"
                    name=""
                    id="uploadImage"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesCreate}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn nhiều ảnh để tải lên</span>
                  </div>
                </div>
                <p className="form-message-error">{accountError.image}</p>
              </div>
              <div className="col-lg-12 form-group">
                <img
                  src={avatarPreview || selectedPhotos}
                  alt=""
                  className="mx-auto d-block preview-thumb"
                />
                {detailPreview.length > 0 && (
                  <div className="preview-images">
                    {detailPreview.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`preview-${index}`}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Tạo mới
                </button>
                <Link
                  to={`/admin/accounts/${slugCategories}`}
                  className="btn btn-cancel"
                >
                  Huỷ bỏ
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountsCreate;
