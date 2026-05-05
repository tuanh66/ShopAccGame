import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import search from "../../assets/svg/search.svg";
import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
import { historyService } from "../../service/historyService";

const applyForLabel = {
  all: "Tất cả",
  account: "Tài khoản",
  random: "Random tài khoản",
};

const DiscountCodeHistory = () => {
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);

  useEffect(() => {
    setNotFoundText("Không có lịch sử sử dụng mã giảm giá nào");
  }, [setNotFoundText]);

  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await historyService.discountCodeHistory();
        if (response.data) {
          setHistories(response.data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử mã giảm giá:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Hàm format tiền tệ (VNĐ)
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0 VNĐ";
    return amount.toLocaleString("en-US") + " VNĐ";
  };

  // Hàm format ngày giờ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = histories.filter(
    (item) =>
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Lịch sử sử dụng mã giảm giá</h4>
          <span>Xem tất cả lịch sử sử dụng mã giảm giá của người dùng</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form
            className="mobi-search"
            style={{ width: "200px", marginBottom: "25px" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <img src={search} alt="search" />
            <input
              type="text"
              className="search-form-input"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Mã giảm giá</th>
                  <th>Loại</th>
                  <th>Áp dụng cho</th>
                  <th>Giá gốc</th>
                  <th>Giảm</th>
                  <th>Giá cuối</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <NotFound />
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.discountCodeHistoryId}>
                      <td>{item.discountCodeHistoryId}</td>
                      <td>{item.user.username}</td>
                      <td>{item.code}</td>
                      <td>
                        {item.type === "percent" ? "Phần trăm" : "Cố định"}
                      </td>
                      <td>{applyForLabel[item.applyFor]}</td>
                      <td>{formatCurrency(item.originalPrice)}</td>
                      <td>{formatCurrency(item.discountAmount)}</td>
                      <td>{formatCurrency(item.finalPrice)}</td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
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
            {filtered.length > 0 && (
              <div className="table-pagination-nav">
                <ul className="pagination-list">
                  <li className="pagination-item active">
                    <Link to="#" className="pagination-link">
                      <span>1</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            <div className="table-pagination-info">
              {filtered.length > 0
                ? `1 - ${filtered.length} of ${filtered.length} items`
                : "Showing 0 to 0 of 0 entries"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountCodeHistory;
