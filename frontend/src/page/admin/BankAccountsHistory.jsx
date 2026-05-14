import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { historyService } from "../../service/historyService";
import { formatCurrency, formatDate } from "../../utils/format";
import NotFound from "../../components/common/NotFound";
import search from "../../assets/svg/search.svg";

const BankAccountsHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  const fetchHistories = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const res = await historyService.bankAccountsHistory(page, limit, search);
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
    const timer = setTimeout(() => {
      fetchHistories(pagination.currentPage, pagination.limit, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [pagination.currentPage, pagination.limit, searchTerm]);

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
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>LỊCH SỬ NẠP TIỀN QUA NGÂN HÀNG</h4>
          <span>Xem tất cả lịch sử nạp tiền qua ngân hàng của người dùng</span>
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
                  <th>Mã giao dịch</th>
                  <th>Người nạp</th>
                  <th>Số tiền</th>
                  <th>Nội dung CK</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : histories.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <NotFound message="Không có dữ liệu" />
                    </td>
                  </tr>
                ) : (
                  histories.map((item) => (
                    <tr key={item.bankAccountsHistoryId}>
                      <td>{item.bankAccountsHistoryId}</td>
                      <td>{item.transaction_id}</td>
                      <td>{item.userName}</td>
                      <td>{formatCurrency(item.amount)}</td>
                      <td>{item.content}</td>
                      <td>
                        {item.status === "success" || !item.status ? (
                          <span className="badges status-success">
                            Thành công
                          </span>
                        ) : (
                          <span className="badges status-error">Thất bại</span>
                        )}
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

export default BankAccountsHistory;
