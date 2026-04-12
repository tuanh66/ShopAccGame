import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import { categoriesService } from "../../service/categoriesService";
import uploadImage from "../../assets/svg/upload.svg";
import selectedPhotos from "../../assets/img/selectedPhotos.png";

const CategoriesCreate = () => {

  // Xử lý lấy dữ liệu
  const [preview, setPreview] = useState(null);
  const [fileImage, setFileImage] = useState(null);
  const [categoryCreate, setCategoryCreate] = useState({
    name: "",
    status: true,
  });

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // xử lý input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCategoryCreate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // upload ảnh nếu có
      if (fileImage) {
        const formData = new FormData();
        formData.append("image", fileImage);

        const resImg = await axios.post(
          "https://api.imgbb.com/1/upload?key=6624e532541b0b39305d1b01b8e065cd",
          formData,
        );

        imageUrl = resImg.data.data.url;
      }

      // gọi API create category
      await categoriesService.createCategories({
        ...categoryCreate,
        image: imageUrl,
      });

      toast.success("Tạo danh mục thành công");

      // reset form
      setCategoryCreate({
        name: "",
        status: true,
      });

      setPreview(null);
      setFileImage(null);
    } catch (error) {
      console.error("Lỗi khi tạo category", error);
      toast.error("Tạo danh mục thất bại");
    }
  };
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Thêm Danh Mục Sản Phẩm</h4>
          <span>Tạo danh mục sản phẩm mới</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-categories" onSubmit={handleSubmit}>
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
                  value={categoryCreate.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="slug">
                  Trạng thái<span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="slug"
                    id="slug"
                    className="select-form"
                    value={categoryCreate.status ? "1" : "0"}
                    onChange={(e) =>
                      setCategoryCreate((prev) => ({
                        ...prev,
                        status: e.target.value === "1",
                      }))
                    }
                  >
                    <option value="0">Không hoạt động</option>
                    <option value="1">Hoạt động</option>
                  </select>
                </div>
              </div>
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
                    onChange={handlePreview}
                  />
                  <div className="image-uploads">
                    <img src={uploadImage} alt="Upload Image" />
                    <span>Kéo thả hoặc chọn ảnh để tải lên</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 form-group">
                <img
                  src={preview || selectedPhotos}
                  alt="preview"
                  className="mx-auto d-block preview-thumb"
                />
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Tạo mới
                </button>
                <Link to="/admin/categories" className="btn btn-cancel">
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

export default CategoriesCreate;
