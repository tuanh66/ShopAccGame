import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import search from "../../assets/svg/search.svg";
import { userService } from "../../service/userService";

const UsersEdit = () => {
  const { userId } = useParams();
  const [userUpdate, setUserUpdate] = useState({
    username: "",
    role: "",
    email: "",
    balance: "",
    maxBalance: "",
    status: "",
  });
  const [transactions, setTransactions] = useState([]);
  const transactionType = {
    bankAccount: {
      label: "Chuyển khoản",
      className: "status-success",
    },
    topUp: {
      label: "Nạp thẻ",
      className: "status-success",
    },
    buyAccount: {
      label: "Mua acc",
      className: "bg-info",
    },
    adminTopUp: {
      label: "Admin sửa",
      className: "bg-danger",
    },
  };

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await userService.readUser(userId);
      setUserUpdate(res.user);
      setTransactions(res.transactions);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu", error);
    }
  }, [userId]);

  useEffect(() => {
    const load = async () => {
      await fetchUser();
    };
    load();
  }, [fetchUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Các field chỉ cho nhập số
    const numberFields = ["maxBalance", "balance"];

    if (numberFields.includes(name)) {
      // bỏ dấu phẩy
      const rawValue = value.replace(/,/g, "");

      // chỉ cho nhập số
      if (!/^\d*$/.test(rawValue)) return;

      setUserUpdate((prev) => ({
        ...prev,
        [name]: rawValue,
      }));

      return;
    }

    if (name === "status") {
      setUserUpdate((prev) => ({
        ...prev,
        status: value === "1", // chuyển về boolean
      }));
      return;
    }

    setUserUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Update dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        role: userUpdate.role,
        balance: Number(userUpdate.balance),
        status: userUpdate.status === "1" || userUpdate.status === true,
      };

      const res = await userService.updateUser(userId, payload);

      toast.success(res.message || "Cập nhật thành công");
      await fetchUser();
    } catch (error) {
      console.error("Lỗi update user", error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Chỉnh sửa người dùng</h4>
          <span>Cập nhật thông tin người dùng</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-user" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="username">
                  Tài khoản
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="input-form"
                  placeholder="Nhập tài khoản"
                  value={userUpdate.username}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="email">
                  Email
                  <span>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input-form"
                  placeholder="Nhập email"
                  value={userUpdate.email}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="role">
                  Vai trò
                  <span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="role"
                    id="role"
                    className="select-form"
                    value={userUpdate.role}
                    onChange={handleChange}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="balance">
                  Số dư
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="balance"
                  id="balance"
                  className="input-form"
                  placeholder="Nhập số tiền"
                  value={Number(userUpdate.balance || 0).toLocaleString(
                    "en-US",
                  )}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="maxBalance">
                  Tổng nạp
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="maxBalance"
                  id="maxBalance"
                  className="input-form"
                  placeholder="Nhập tổng nạp"
                  value={Number(userUpdate.maxBalance || 0).toLocaleString(
                    "en-US",
                  )}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-12 form-group">
                <label htmlFor="status">
                  Hoạt động
                  <span>*</span>
                </label>
                <div className="input-group">
                  <select
                    name="status"
                    id="status"
                    className="select-form"
                    value={userUpdate.status ? "1" : "0"}
                    onChange={handleChange}
                  >
                    <option value="0">Bị khoá</option>
                    <option value="1">Hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Cập nhật
                </button>
                <Link to="/admin/users" className="btn btn-cancel">
                  Huỷ bỏ
                </Link>
              </div>
            </div>
          </form>
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
                  <th>Loại giao dịch</th>
                  <th>Số tiền</th>
                  <th>Số dư trước</th>
                  <th>Số dư sau</th>
                  <th>Mô tả</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{transactions.length - index}</td>
                      <td>
                        <span
                          className={`badges ${transactionType[item.transaction]?.className || "bg-secondary"}`}
                        >
                          {transactionType[item.transaction]?.label ||
                            item.transaction}
                        </span>
                      </td>
                      <td
                        className={
                          item.balance_after > item.balance_before
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {item.balance_after > item.balance_before ? "+" : "-"}
                        {Number(item.amount).toLocaleString("en-US")}đ
                      </td>
                      <td>
                        {Number(item.balance_before).toLocaleString("en-US")}đ
                      </td>
                      <td>
                        {Number(item.balance_after).toLocaleString("en-US")}đ
                      </td>
                      <td>{item.description}</td>
                      <td>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td valign="top" colSpan={7} className="text-center">
                      No data available in table
                    </td>
                  </tr>
                )}
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

export default UsersEdit;
