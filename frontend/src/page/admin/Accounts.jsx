import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import search from "../../assets/svg/search.svg";
import icon_plus from "../../assets/svg/plus.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const Accounts = () => {
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

  // Xử lý lấy dữ liệu
  const { slugCategories } = useParams();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/accounts/admin/category/${slugCategories}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setAccounts(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };

    if (slugCategories) {
      fetchAccounts();
    }
  }, [slugCategories]);

  const [deleteAccount, setDeleteAccount] = useState(null);
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/accounts/admin/${deleteAccount._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setAccounts(accounts.filter((item) => item._id));
      close(); // đóng modal
      toast.success(`Đã xoá tài khoản ${deleteAccount.username} thành công`);
    } catch (error) {
      console.error("Lỗi xoá danh mục", error);
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
            Thêm tài khoản mới
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
                  <th>Giá tiền</th>
                  <th>Trạng thái</th>
                  <th>Ảnh đại diện</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>
                      {item.price
                        ? Number(item.price).toLocaleString("en-US") + " VNĐ"
                        : "0 VNĐ"}
                    </td>
                    <td>
                      <span
                        className={`badges ${item.status ? "status-error" : "status-success"}`}
                      >
                        {item.sold_detail ? "Đã bán" : "Chưa bán"}
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
                    <td>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <Link to={`edit/${item._id}`}>
                          <img src={icon_edit} alt="edit" className="me-3" />
                        </Link>
                        <Link to="#">
                          <img
                            src={icon_delete}
                            alt="delete"
                            onClick={() => {
                              setDeleteAccount(item);
                              setShowModalDelete(true);
                            }}
                          />
                        </Link>
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
                                    Bạn có chắc chắn muốn xóa tài khoản{" "}
                                    <b>{deleteAccount.username}</b> này không?
                                    Tất cả dữ liệu có liên quan đến nó sẽ biến
                                    mất khỏi hệ thống!
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-submit red"
                                      onClick={handleDelete}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Accounts;
