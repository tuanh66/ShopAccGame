import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import uploadImage from "../../assets/svg/upload.svg";
import selectedPhotos from "../../assets/img/selectedPhotos.png";
import icon_delete from "../../assets/svg/delete.svg";

const CategoriesEdit = () => {
  // Xử lý mở tắt modal
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const close = () => {
    setShowEffect(false);
    setTimeout(() => {
      setShowModalDelete(false);
    }, 300);
  };

  useEffect(() => {
    if (showModalDelete) {
      setTimeout(() => {
        setShowEffect(true);
      }, 10);
    }
  }, [showModalDelete]);
  // End Xử lý mở tắt modal

  const [preview, setPreview] = useState(null);
  const [fileImage, setFileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [newAttribute, setNewAttribute] = useState({
    label: "",
    type: "text",
    options: "",
  });

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileImage(file); // lưu file để upload
    setPreview(URL.createObjectURL(file));
  };

  // Xử lý lấy dữ liệu
  const accessToken = useAuthStore((s) => s.accessToken);
  const { id } = useParams();
  const [categoriesUpdate, setCategoriesUpdate] = useState({
    name: "",
    slug: "",
    attributes: {},
    status: true,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/categories/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setCategoriesUpdate(res.data.data);
        setLoadingImage(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };

    if (id) fetchCategory();
  }, [id]);
  // End Xử lý lấy dữ liệu

  //  Xử lý change input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setCategoriesUpdate((prev) => ({
        ...prev,
        status: value === "1", // chuyển về boolean
      }));
      return;
    }

    setCategoriesUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = categoriesUpdate.image_category;

      if (fileImage) {
        const formData = new FormData();
        formData.append("image", fileImage);

        const resImg = await axios.post(
          `https://api.imgbb.com/1/upload?key=6624e532541b0b39305d1b01b8e065cd`,
          formData,
        );

        imageUrl = resImg.data.data.url;
      }

      const res = await axios.put(
        `http://localhost:5001/api/categories/admin/${id}`,
        {
          ...categoriesUpdate,
          image_category: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setCategoriesUpdate(res.data.data);

      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật", error);
      toast.error("Cập nhật thất bại");
    }
  };

  const handleAddAttribute = async () => {
    if (!newAttribute.label) {
      toast.error("Vui lòng nhập label");
      return;
    }

    try {
      const formattedOptions =
        newAttribute.type === "select"
          ? newAttribute.options
              .split(",")
              .map((opt) => opt.trim())
              .filter((opt) => opt !== "")
          : [];

      const res = await axios.post(
        `http://localhost:5001/api/categories/admin/${id}/attribute`,
        {
          label: newAttribute.label,
          type: newAttribute.type,
          options: formattedOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // Cập nhật lại state từ response backend
      setCategoriesUpdate((prev) => ({
        ...prev,
        attributes: res.data.data,
      }));

      setNewAttribute({
        label: "",
        type: "text",
        options: "",
      });

      toast.success("Thêm thuộc tính thành công");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Thêm thất bại");
    }
  };

  const [deleteAttribute, setDeleteAttribute] = useState(null);
  const handleDeleteAttribute = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5001/api/categories/admin/${id}/attribute/${deleteAttribute.key}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setCategoriesUpdate((prev) => ({
        ...prev,
        attributes: res.data.data,
      }));
      close();
      toast.success(`Xoá thuộc tính ${deleteAttribute?.label} thành công`);
    } catch (error) {
      console.error("Lỗi xoá danh mục", error);
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>CHỈNH SỬA DANH MỤC GAME</h4>
          <span>Cập nhật thông tin danh mục game</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="categories-edit" onSubmit={handleSubmit}>
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
                  className="input-form"
                  value={categoriesUpdate.name}
                  onChange={handleChange}
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
                  value={categoriesUpdate.slug}
                  readOnly
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
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
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="status">
                  Trạng thái<span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="status"
                    id="status"
                    className="select-form"
                    value={categoriesUpdate.status ? "1" : "0"}
                    onChange={handleChange}
                  >
                    <option value="0">Không hoạt động</option>
                    <option value="1">Hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12 form-group">
                <img
                  src={preview || categoriesUpdate.image || selectedPhotos}
                  alt="Preview"
                  className="mx-auto d-block preview-thumb"
                  onLoad={() => setLoadingImage(false)}
                  onError={(e) => {
                    e.target.src = selectedPhotos;
                  }}
                />
              </div>
              <div className="col-lg-12 form-group">
                <button className="btn btn-submit primary me-2" type="submit">
                  Cập nhật
                </button>
                <Link to="/admin/categories" className="btn btn-cancel">
                  Huỷ bỏ
                </Link>
              </div>
              <div className="col-lg-12 form-group">
                <label>Thêm thuộc tính</label>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <input
                      type="text"
                      placeholder="Label (vd: Mức Rank)"
                      className="input-form"
                      value={newAttribute.label}
                      onChange={(e) =>
                        setNewAttribute((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="col-md-2 mb-2">
                    <select
                      className="select-form"
                      value={newAttribute.type}
                      onChange={(e) =>
                        setNewAttribute((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                    </select>
                  </div>

                  {newAttribute.type === "select" && (
                    <div className="col-md-3 mb-2">
                      <input
                        type="text"
                        placeholder="Options cách nhau dấu phẩy"
                        className="input-form"
                        value={newAttribute.options}
                        onChange={(e) =>
                          setNewAttribute((prev) => ({
                            ...prev,
                            options: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="col-lg-3 col-md-2 mb-2">
                    <button
                      type="button"
                      className="btn btn-submit primary"
                      onClick={handleAddAttribute}
                    >
                      Thêm thuộc tính
                    </button>
                  </div>

                  {/* Hiển thị danh sách attribute đã thêm */}
                  <div className="form-group">
                    {categoriesUpdate.attributes &&
                      Object.entries(categoriesUpdate.attributes).map(
                        ([key, attr]) => (
                          <div
                            key={key}
                            className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <strong>{attr.label}</strong> ({attr.type})
                              {attr.type === "select" && (
                                <div style={{ fontSize: "12px" }}>
                                  Options: {attr.options?.join(", ")}
                                </div>
                              )}
                            </div>
                            <Link>
                              <img
                                src={icon_delete}
                                alt=""
                                onClick={() => {
                                  setDeleteAttribute({
                                    key,
                                    label: attr.label,
                                  });
                                  setShowModalDelete(true);
                                }}
                              />
                            </Link>
                          </div>
                        ),
                      )}
                    {showModalDelete && (
                      <>
                        <div
                          className={`modal fade ${showEffect ? "show" : ""}`}
                          style={{
                            display: showModalDelete ? "block" : "none",
                          }}
                          onClick={close}
                        >
                          <div
                            className="modal-dialog"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1 className="modal-title fs-5">
                                  Xác nhận xoá
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  onClick={close}
                                ></button>
                              </div>
                              <div className="modal-body">
                                Bạn có chắc chắn muốn xóa danh mục{" "}
                                <b>{deleteAttribute?.label}</b> này không? Tất
                                cả dữ liệu có liên quan đến nó sẽ biến mất khỏi
                                hệ thống!
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-submit red"
                                  onClick={handleDeleteAttribute}
                                >
                                  Xoá
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-cancel"
                                  onClick={close}
                                >
                                  Huỷ
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`modal-backdrop fade ${showEffect ? "show" : ""}`}
                        ></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CategoriesEdit;
