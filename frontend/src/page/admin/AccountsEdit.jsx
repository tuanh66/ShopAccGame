import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import uploadImage from "../../assets/svg/upload.svg";
import selectedPhotos from "../../assets/img/selectedPhotos.png";

const AccountsEdit = () => {
  const { id, slugCategories } = useParams();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [accountslUpdate, setAccountslUpdate] = useState({
    username: "",
    password: "",
    price: "",
    price_sale: "",
    avatar: "",
    image: [],
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [detailPreview, setDetailPreview] = useState([]);
  const [detailFiles, setDetailFiles] = useState([]);
  const [loadingImage, setLoadingImage] = useState(true);
  const [attributes, setAttributes] = useState({});
  const [attributeValues, setAttributeValues] = useState({});
  const handleAttributeChange = (key, value) => {
    setAttributeValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDetailImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setDetailFiles(files);
    setDetailPreview(files.map((file) => URL.createObjectURL(file)));
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/accounts/admin/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const account = res.data.accounts;
        const category = res.data.categories;

        // schema attributes
        setAttributes(category.attributes);

        // value attributes
        setAttributeValues(account.attributes || {});

        setAccountslUpdate({
          username: account.username,
          password: account.password,
          price: account.price,
          price_sale: account.price_sale,
          avatar: account.avatar,
          image: account.image,
          status: account.status,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccount();
  }, [id]);

  // 🟢 Xử lý change input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountslUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let avatarUrl = accountslUpdate.avatar;
      let imageUrls = accountslUpdate.image || [];

      // Upload avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);

        const resImg = await axios.post(
          `https://api.imgbb.com/1/upload?key=6624e532541b0b39305d1b01b8e065cd`,
          formData,
        );

        avatarUrl = resImg.data.data.url;
      }

      // Upload nhiều ảnh chi tiết
      if (detailFiles.length > 0) {
        const uploadPromises = detailFiles.map((file) => {
          const formData = new FormData();
          formData.append("image", file);
          return axios.post(
            `https://api.imgbb.com/1/upload?key=6624e532541b0b39305d1b01b8e065cd`,
            formData,
          );
        });

        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((res) => res.data.data.url);
      }

      await axios.put(
        `http://localhost:5001/api/accounts/admin/${id}`,
        {
          ...accountslUpdate,
          avatar: avatarUrl,
          image: imageUrls,
          attributes: attributeValues,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Chỉnh sửa tài khoản game</h4>
          <span>Cập nhật thông tin tài khoản game</span>
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
                  className="input-form"
                  value={accountslUpdate.username}
                  onChange={handleChange}
                />
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
                  className="input-form"
                  value={accountslUpdate.password}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="price">
                  Giá tiền
                  <span>*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Nhập giá tiền"
                  className="input-form"
                  value={accountslUpdate.price}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="price_sale">
                  Giá tiền giảm
                  <span>*</span>
                </label>
                <input
                  type="number"
                  name="price_sale"
                  id="price_sale"
                  placeholder="Nhập giá giảm"
                  className="input-form"
                  value={accountslUpdate.price_sale || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label>
                  Trạng thái<span>*</span>
                </label>
                <div className="input-group">
                  <select
                    className="select-form"
                    value={accountslUpdate.status ? "1" : "0"}
                    onChange={(e) =>
                      setAccountslUpdate((prev) => ({
                        ...prev,
                        status: e.target.value === "1",
                      }))
                    }
                  >
                    <option value="0">Chưa bán</option>
                    <option value="1">Đã bán</option>
                  </select>
                </div>
              </div>
              {Object.entries(attributes || {}).map(([key, attr]) => {
                if (!attr) return null;

                return (
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
                        value={attributeValues[key] || ""}
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
                        value={attributeValues[key] ?? ""}
                        onChange={(e) =>
                          handleAttributeChange(
                            key,
                            attr.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                        placeholder={`Nhập ${attr.label}`}
                      />
                    )}
                  </div>
                );
              })}
              <div className="col-lg-12 form-group">
                <label>
                  Ảnh đại diện<span>*</span>
                </label>
                <div className="image-upload">
                  <input
                    type="file"
                    name=""
                    id="uploadImage"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn ảnh để tải lên</span>
                  </div>
                </div>
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
                    onChange={handleDetailImagesChange}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn nhiều ảnh để tải lên</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 form-group">
                <img
                  src={
                    avatarPreview || accountslUpdate.avatar || selectedPhotos
                  }
                  alt={accountslUpdate._id}
                  className="mx-auto d-block preview-thumb"
                  onLoad={() => setLoadingImage(false)}
                  onError={(e) => {
                    e.target.src = selectedPhotos;
                  }}
                />
                <div className="preview-images">
                  {(detailPreview.length
                    ? detailPreview
                    : accountslUpdate.image.length
                      ? accountslUpdate.image
                      : [selectedPhotos]
                  ).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={accountslUpdate._id}
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Cập nhật
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

export default AccountsEdit;
