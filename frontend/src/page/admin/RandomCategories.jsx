import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriesService } from "../../service/categoriesService";
import { formatCurrency, formatDate } from "../../utils/format";
import { useModal } from "../../hooks/useModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import NotFound from "../../components/common/NotFound";
import search from "../../assets/svg/search.svg";
import icon_plus from "../../assets/svg/plus.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const RandomCategories = () => {
  const { showModal, showEffect, openModal, closeModal } = useModal();
  // Lấy API service
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesService.readRandomCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể tải danh sách danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [deleteCategories, setDeleteCategories] = useState(null);
  const handleDelete = async () => {
    try {
      await categoriesService.deleteRandomCategory(deleteCategories._id);
      setCategories(
        categories.filter((item) => item._id !== deleteCategories._id),
      );
      closeModal();
      toast.success(`Đã xoá danh mục ${deleteCategories.name} thành công`);
    } catch (error) {
      toast.error(`Lỗi xoá danh mục ${deleteCategories.name}`);
      console.error("Lỗi xoá danh mục", error);
    }
  };
  // End Lấy API service
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>DANH SÁCH DANH MỤC RANDOM ACCOUNTS</h4>
          <span>Quản lý danh mục random accounts của bạn</span>
        </div>
        <div className="page-btn">
          <Link to="create" className="btn primary btn-added">
            <img src={icon_plus} alt="add" className=" me-1" />
            Thêm danh mục
          </Link>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form
            className="mobi-search"
            style={{ width: "200px", marginBottom: "25px" }}
          >
            <img src={search} alt="search" />
            <input
              type="text"
              className="search-form-input"
              placeholder="Tìm kiếm"
            />
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Giá tiền</th>
                  <th>Ảnh đại diện</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <NotFound message="Không có dữ liệu" />
                    </td>
                  </tr>
                ) : (
                  categories.map((item) => (
                    <tr key={item.randomCategoriesId}>
                      <td>{item.randomCategoriesId}</td>
                      <td>{item.name}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-thumbnail"
                          style={{ width: "200px" }}
                        />
                      </td>
                      <td>
                        <span
                          className={`badges ${item.status ? "status-success" : "status-error"}`}
                        >
                          {item.status ? "Hoạt động" : "Tạm khóa"}
                        </span>
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Link to={`edit/${item.randomCategoriesId}`}>
                            <img src={icon_edit} alt="edit" className="me-3" />
                          </Link>
                          <Link to="#">
                            <img
                              src={icon_delete}
                              alt="delete"
                              onClick={() => {
                                setDeleteCategories(item);
                                openModal();
                              }}
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ConfirmDeleteModal
              show={showModal}
              showEffect={showEffect}
              onClose={closeModal}
              onConfirm={handleDelete}
              message="Bạn có chắc chắn muốn xóa danh mục"
              itemName={deleteCategories?.name}
            />
            <div className="table-pagination-control">
              <span className="me-1">Show per page :</span>
              <select className="custom-select">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="table-pagination-nav">
              <ul className="pagination-list">
                <li className="pagination-item active">
                  <Link to="#" className="pagination-link">
                    <span>1</span>
                  </Link>
                </li>
                <li className="pagination-item">
                  <Link to="#" className="pagination-link">
                    <span>2</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="table-pagination-info">1 - 5 of 5 items</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RandomCategories;
