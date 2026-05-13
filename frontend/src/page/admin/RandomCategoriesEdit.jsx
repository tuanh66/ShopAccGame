import { imageService } from "../../service/imageService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoriesService } from "../../service/categoriesService";
import uploadImage from "../../assets/svg/upload.svg";
import PriceInput from "../../components/common/PriceInput";

const RandomCategoriesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    status: true,
    chance: {
      thuong: 80,
      ngon: 15,
      sieuPham: 5,
    },
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await categoriesService.readRandomCategoriesById(id);
        const category = res.data;
        setFormData({
          name: category.name,
          slug: category.slug,
          price: category.price,
          status: category.status,
          chance: category.chance,
        });
        setPreview(category.image);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu danh mục", error);
        toast.error("Không thể lấy dữ liệu danh mục");
      }
    };
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "thuong" || name === "ngon" || name === "sieuPham") {
      setFormData({
        ...formData,
        chance: {
          ...formData.chance,
          [name]: Number(value),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "status" ? value === "1" : value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalChance =
      formData.chance.thuong + formData.chance.ngon + formData.chance.sieuPham;
    if (totalChance !== 100) {
      return toast.error("Tổng xác suất phải bằng 100%!");
    }

    setLoading(true);
    try {
      let imageUrl = preview;

      if (image) {
        imageUrl = await imageService.uploadImage(image);
      }

      const res = await categoriesService.updateRandomCategories(id, {
        ...formData,
        image: imageUrl,
      });

      toast.success(res.message);
      navigate("/admin/random-categories");
    } catch (error) {
      console.error("Lỗi cập nhật danh mục random", error);
      toast.error(error.response?.data?.message || "Lỗi cập nhật danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>CHỈNH SỬA DANH MỤC RANDOM ACCOUNTS</h4>
          <span>Cập nhật thông tin danh mục random account</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-random-categories" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="name">
                  Tên danh mục
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Nhập tên danh mục"
                  className="input-form"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="slug_category">
                  Slug
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="slug_category"
                  id="slug_category"
                  className="input-form"
                  value={formData.slug}
                  readOnly
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="price">
                  Giá tiền<span>*</span>
                </label>
                <PriceInput
                  id="price"
                  name="price"
                  placeholder="Nhập giá tiền"
                  className="input-form"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="status">
                  Trạng thái<span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="status"
                    id="status"
                    className="select-form"
                    value={formData.status ? "1" : "0"}
                    onChange={handleInputChange}
                  >
                    <option value="0">Không hoạt động</option>
                    <option value="1">Hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="sieuPham">
                  Siêu phẩm (%)<span>*</span>
                </label>
                <input
                  id="sieuPham"
                  name="sieuPham"
                  type="number"
                  placeholder="Nhập xác xuất"
                  value={formData.chance.sieuPham}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                  required
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="ngon">
                  Ngon (%)<span>*</span>
                </label>
                <input
                  id="ngon"
                  name="ngon"
                  type="number"
                  placeholder="Nhập xác xuất"
                  value={formData.chance.ngon}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                  required
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="thuong">
                  Thường (%)<span>*</span>
                </label>
                <input
                  id="thuong"
                  name="thuong"
                  type="number"
                  placeholder="Nhập xác xuất"
                  value={formData.chance.thuong}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                  required
                />
              </div>
              <div className="col-lg-12 form-group">
                <label>
                  Ảnh đại diện<span>*</span>
                </label>
                <div className="image-upload">
                  <input
                    type="file"
                    id="uploadImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn ảnh để tải lên</span>
                  </div>
                </div>
              </div>
              {preview && (
                <div className="col-lg-12 form-group">
                  <img
                    src={preview}
                    alt="preview"
                    className="mx-auto d-block preview-thumb"
                  />
                </div>
              )}
              <div className="col-lg-12">
                <button
                  className={`btn btn-submit primary me-2 ${loading ? "disabled" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Cập nhật"}
                </button>
                <Link to="/admin/random-categories" className="btn btn-cancel">
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

export default RandomCategoriesEdit;
