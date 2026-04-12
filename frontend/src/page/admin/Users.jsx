import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import search from "../../assets/svg/search.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const Users = () => {
  // Xử lý mở tắt modal
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const close = () => {
    setShowEffect(false); // bỏ class show -> fade-out
    setTimeout(() => {
      setShowModalDelete(false); // xoá modal khỏi DOM sau hiệu ứng
    }, 300); // đúng 300ms như Vue
  };

  useEffect(() => {
    if (showModalDelete) {
      // giống watch(newVal === true)
      setTimeout(() => {
        setShowEffect(true);
      }, 10);
    }
  }, [showModalDelete]);
  // End Xử lý mở tắt modal

  // Xử lý lấy dữ liệu
  const accessToken = useAuthStore((s) => s.accessToken);
  const [user, setUser] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/users/admin/list",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setUser(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };

    fetchUser();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/users/admin/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(user.filter((item) => item._id !== deleteId));
      close(); // đóng modal
      toast.success(`Đã xoá ${deleteName} thành công`);
    } catch (error) {
      console.error("Lỗi xoá danh mục", error);
    }
  };
  // End Xử lý lấy dữ liệu
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>USERS LIST</h4>
          <span>Manage your users</span>
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
                  <th>Tài khoản</th>
                  <th>Email</th>
                  <th>Cấp bậc</th>
                  <th>Số dư</th>
                  <th>Tổng nạp</th>
                  <th>Trạng thái</th>
                  <th>IP</th>
                  <th>Ngày tạo</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {user.map((item, index) => (
                  <tr key={item._id}>
                    <td>{item.userId}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>
                      <span
                        className={`badges ${
                          item.role === "admin"
                            ? "status-error"
                            : "status-success"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td>{Number(item.balance).toLocaleString("en-US")}đ</td>
                    <td>{item.maxBalance}đ</td>
                    <td>
                      <span
                        className={`badges ${item.status ? "status-success" : "status-error"}`}
                      >
                        {item.status ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td>{item.lastIp}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <Link to={`edit/${item.userId}`}>
                          <img src={icon_edit} alt="edit" className="me-3" />
                        </Link>
                        <Link
                          to="#"
                          onClick={() => {
                            setDeleteId(item._id);
                            setDeleteName(item.username);
                            setShowModalDelete(true);
                          }}
                        >
                          <img src={icon_delete} alt="delete" />
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
                                    <b>{deleteName}</b> này không? Tất cả dữ
                                    liệu có liên quan đến nó sẽ biến mất khỏi hệ
                                    thống!
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

export default Users;
