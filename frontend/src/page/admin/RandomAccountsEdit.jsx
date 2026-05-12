import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { accountsService } from "../../service/accountsService";
import { imageService } from "../../service/imageService";
import uploadImage from "../../assets/svg/upload.svg";

const RandomAccountsEdit = () => {
  const { id, slugCategories } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    tier: "thuong",
    status: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        const res = await accountsService.readRandomAccountById(id);
        const data = res.data;
        setFormData({
          username: data.username,
          password: data.password,
          tier: data.tier,
          status: data.status,
        });
        setExistingImages(data.image || []);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tài khoản:", error);
        toast.error("Không thể lấy thông tin tài khoản");
      }
    };
    fetchAccountDetail();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "1" : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedUrls = [];
      if (newImages.length > 0) {
        uploadedUrls = await imageService.uploadImages(newImages);
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      await accountsService.updateRandomAccount(id, {
        ...formData,
        image: finalImages,
      });

      toast.success("Cập nhật tài khoản thành công");
      navigate(`/admin/random-accounts/${slugCategories}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>CHỈNH SỬA RANDOM ACCOUNTS</h4>
          <span>Cập nhật thông tin random account #{id}</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-random-accounts" onSubmit={handleSubmit}>
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
                  value={formData.username}
                  onChange={handleInputChange}
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
                  placeholder="Nhập mật khẩu"
                  className="input-form"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="tier">
                  Bậc
                  <span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="tier"
                    id="tier"
                    className="input-form"
                    value={formData.tier}
                    onChange={handleInputChange}
                  >
                    <option value="thuong">Thường</option>
                    <option value="ngon">Ngon</option>
                    <option value="sieuPham">Siêu phẩm</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="status">
                  Trạng thái
                  <span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="status"
                    id="status"
                    className="input-form"
                    value={formData.status ? "1" : "0"}
                    onChange={handleInputChange}
                  >
                    <option value="0">Chưa bán</option>
                    <option value="1">Đã bán</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12 form-group">
                <label>
                  Ảnh chi tiết<span>*</span>
                </label>
                <div className="image-upload">
                  <input
                    type="file"
                    id="uploadImage"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn nhiều ảnh mới để tải lên</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 form-group">
                <div className="preview-images d-flex flex-wrap gap-3">
                  {/* Existing Images */}
                  {existingImages.map((src, index) => (
                    <div key={`existing-${index}`} className="position-relative">
                      <img
                        src={src}
                        alt={`Existing ${index}`}
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #28a745",
                        }}
                      />
                      <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 bg-white"
                        onClick={() => handleRemoveExistingImage(index)}
                      ></button>
                    </div>
                  ))}
                  {/* New Previews */}
                  {newPreviews.map((src, index) => (
                    <div key={`new-${index}`} className="position-relative">
                      <img
                        src={src}
                        alt={`New Preview ${index}`}
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #007bff",
                        }}
                      />
                      <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 bg-white"
                        onClick={() => handleRemoveNewImage(index)}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-12">
                <button
                  className={`btn btn-submit primary me-2 ${loading ? "disabled" : ""} `}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Cập nhật"}
                </button>
                <Link
                  to={`/admin/random-accounts/${slugCategories}`}
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

export default RandomAccountsEdit;
