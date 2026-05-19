import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { historyService } from "@/service/historyService";
import { formatDate, formatCurrency } from "@/utils/format";
import NotFound from "@/components/common/NotFound";
import search from "@/assets/svg/search.svg";

const UserHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);

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
    discountCode: {
      label: "Mã giảm giá",
      className: "bg-secondary",
    },
  };

  // States cho phân trang
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  const fetchHistories = async (
    page = 1,
    limit = 10,
    search = "",
    today = todayOnly,
  ) => {
    setLoading(true);
    try {
      const res = await historyService.readUserTransactionHistoryAdmin(
        page,
        limit,
        search,
        today,
      );
      setHistories(res.data);
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
    // Thêm debounce nhẹ cho tìm kiếm để tránh gọi API quá nhiều
    const timer = setTimeout(() => {
      fetchHistories(
        pagination.currentPage,
        pagination.limit,
        searchTerm,
        todayOnly,
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [pagination.currentPage, pagination.limit, searchTerm, todayOnly]);

  // Xử lý đổi trang
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Xử lý đổi số lượng hiển thị
  const handleLimitChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      currentPage: 1, // Reset về trang 1 khi đổi limit
    }));
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>LỊCH SỬ GIAO DỊCH</h4>
          <span>Xem tất cả lịch sử giao dịch của người dùng</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-25 flex-wrap gap-3">
            <div className="mobi-search" style={{ width: "250px" }}>
              <img src={search} alt="search" />
              <input
                type="text"
                className="search-form-input"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="btn-group" role="group" aria-label="Date Filter">
              <button
                type="button"
                className={`btn ${todayOnly ? "primary text-white fw-600" : "btn-light text-dark fw-600 border"}`}
                onClick={() => {
                  setTodayOnly(true);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
              >
                Hôm nay
              </button>
              <button
                type="button"
                className={`btn ${!todayOnly ? "primary text-white fw-600" : "btn-light text-dark fw-600 border"}`}
                onClick={() => {
                  setTodayOnly(false);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
              >
                Tất cả lịch sử
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Loại giao dịch</th>
                  <th>Số tiền</th>
                  <th>Số dư trước</th>
                  <th>Số dư sau</th>
                  <th>Mô tả</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : histories.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <NotFound message="Không có dữ liệu" />
                    </td>
                  </tr>
                ) : (
                  histories.map((item) => (
                    <tr key={item.userHistoryId}>
                      <td>#{item.userHistoryId}</td>
                      <td>{item.username}</td>
                      <td>
                        <span
                          className={`badges ${transactionType[item.transaction]?.className || "bg-secondary"}`}
                          style={{ width: "100px" }}
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
                        {formatCurrency(item.amount)}
                      </td>
                      <td>{formatCurrency(item.balance_before)}</td>
                      <td>{formatCurrency(item.balance_after)}</td>
                      <td>{item.description}</td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* PHẦN PHÂN TRANG */}
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

export default UserHistory;
