import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { accountsService } from "../../service/accountsService";
import { formatCurrency, formatDate } from "../../utils/format";
import NotFound from "../../components/common/NotFound";
import { useModal } from "../../hooks/useModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import search from "../../assets/svg/search.svg";
import icon_plus from "../../assets/svg/plus.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const Accounts = () => {
  const { slugCategories } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  const fetchAccounts = async (page = 1, limit = 10, search = "") => {
    try {
      const res = await accountsService.readAccounts(
        slugCategories,
        page,
        limit,
        search,
      );
      setAccounts(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Không thể lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slugCategories) {
      const timer = setTimeout(() => {
        fetchAccounts(pagination.currentPage, pagination.limit, searchTerm);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [slugCategories, pagination.currentPage, pagination.limit, searchTerm]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      currentPage: 1,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const [deleteAccount, setDeleteAccount] = useState(null);
  const { showModal, showEffect, openModal, closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/accounts/admin/${deleteAccount._id}`,
      );
      setAccounts(accounts.filter((item) => item._id !== deleteAccount._id));
      closeModal(); // đóng modal
      toast.success(`Đã xoá tài khoản ${deleteAccount.username} thành công`);
    } catch (error) {
      console.error("Lỗi xoá tài khoản", error);
    }
  };
  // End Xử lý lấy dữ liệu
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>DANH SÁCH TÀI KHOẢN GAME</h4>
          <span>Quản lý tài khoản game của bạn</span>
        </div>
        <div className="page-btn">
          <Link to="create" className="btn primary btn-added">
            <img src={icon_plus} alt="add" className=" me-1" />
            Thêm tài khoản
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên tài khoản</th>
                  <th>Giá tiền</th>
                  <th>Trạng thái</th>
                  <th>Ảnh đại diện</th>
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
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <NotFound message="Không có dữ liệu" />
                    </td>
                  </tr>
                ) : (
                  accounts.map((item) => (
                    <tr key={item.accountsId}>
                      <td>{item.accountsId}</td>
                      <td>{item.username}</td>
                      <td>{formatCurrency(item.final_price)}</td>
                      <td>
                        <span
                          className={`badges ${item.status ? "status-error" : "status-success"}`}
                        >
                          {item.status ? "Đã bán" : "Chưa bán"}
                        </span>
                      </td>
                      <td>
                        <img
                          src={item.avatar}
                          alt={item.user}
                          className="img-thumbnail"
                          style={{ width: "200px" }}
                        />
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Link to={`edit/${item.accountsId}`}>
                            <img src={icon_edit} alt="edit" className="me-3" />
                          </Link>
                          <Link to="#">
                            <img
                              src={icon_delete}
                              alt="delete"
                              onClick={() => {
                                setDeleteAccount(item);
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
              message="Bạn có chắc chắn muốn xóa tài khoản"
              itemName={deleteAccount?.username}
            />
            <div className="table-pagination-control">
              <span className="me-1">Show per page :</span>
              <select
                className="custom-select"
                value={pagination.limit}
                onChange={handleLimitChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="table-pagination-nav">
              <ul className="pagination-list">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <li
                    className={`pagination-item ${
                      pagination.currentPage === page ? "active" : ""
                    }`}
                    key={page}
                  >
                    <Link
                      to="#"
                      className="pagination-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                    >
                      <span>{page}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="table-pagination-info">
              {pagination.total > 0
                ? `${pagination.total - Math.min(pagination.currentPage * pagination.limit, pagination.total) + 1} - ${
                    pagination.total -
                    (pagination.currentPage - 1) * pagination.limit
                  }`
                : "0 - 0"}{" "}
              of {pagination.total} items
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
