  import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { accountsService } from "@/service/accountsService";
import { formatDate } from "../../utils/format";
import NotFound from "../../components/common/NotFound";
import { useModal } from "../../hooks/useModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import search from "../../assets/svg/search.svg";
import icon_plus from "../../assets/svg/plus.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const RandomAccounts = () => {
  const { showModal, showEffect, openModal, closeModal } = useModal();
  // Lấy API service
  const { slugCategories } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountsService.readRandomAccounts(slugCategories);
        setAccounts(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    if (slugCategories) {
      fetchAccounts();
    }
  }, [slugCategories]);

  const [deleteAccount, setDeleteAccount] = useState(null);
  const handleDelete = async () => {
    try {
      await accountsService.deleteRandomAccount(deleteAccount.randomAccountsId);
      setAccounts(accounts.filter((item) => item.randomAccountsId !== deleteAccount.randomAccountsId));
      closeModal();
      toast.success(`Đã xoá tài khoản ${deleteAccount.username} thành công`);
    } catch (error) {
      toast.error(`Lỗi xoá tài khoản ${deleteAccount.username}`);
      console.error("Lỗi xoá tài khoản", error);
    }
  };
  // End Lấy API service
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>DANH SÁCH RANDOM ACCOUNTS</h4>
          <span>Quản lý random accounts của bạn</span>
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
            />
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên tài khoản</th>
                  <th>Bậc</th>
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
                      <NotFound message="Chưa có tài khoản random" />
                    </td>
                  </tr>
                ) : (
                  accounts.map((item) => (
                    <tr key={item.randomAccountsId}>
                      <td>{item.randomAccountsId}</td>
                      <td>{item.username}</td>
                      <td>
                        {item.tier === "thuong"
                          ? "Thường"
                          : item.tier === "ngon"
                            ? "Ngon"
                            : "Siêu phẩm"}
                      </td>
                      <td>
                        <span
                          className={`badges ${item.status ? "status-error" : "status-success"}`}
                        >
                          {item.status ? "Đã bán" : "Chưa bán"}
                        </span>
                      </td>
                      <td>
                        <img
                          src={item.image?.[0]}
                          alt={item.username}
                          className="img-thumbnail"
                          style={{ width: "200px" }}
                        />
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Link to={`edit/${item.randomAccountsId}`}>
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

export default RandomAccounts;
