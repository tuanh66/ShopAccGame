import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/common/Loading";
import search from "../../assets/svg/search.svg";
import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
import { historyService } from "../../service/historyService";

const CardTopUpHistory = () => {
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);
  const setGlobalLoading = useUIStore((s) => s.setGlobalLoading);
  useEffect(() => {
    setNotFoundText("Không có lịch sử nạp thẻ cào");
    setGlobalLoading(false);
  }, [setNotFoundText, setGlobalLoading]);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await historyService.cardTopUpHistory();
        if (response.data) {
          setHistories(response.data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử nạp thẻ:", error);
      } finally {
        setLoading(false); // Mở khóa lại để chạy thực tế
      }
    };
    fetchHistory();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return "0 VNĐ";
    return amount.toLocaleString("en-US") + " VNĐ";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Lịch sử nạp tiền qua thẻ cào</h4>
          <span>Xem tất cả lịch sử nạp tiền qua thẻ cào của người dùng</span>
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
                  <th>Người nạp</th>
                  <th>Nhà mạng</th>
                  <th>Mệnh giá</th>
                  <th>Thực nhận</th>
                  <th>Mã thẻ</th>
                  <th>Serial</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <Loading isOverlay={false} loading={loading} />
                    </td>
                  </tr>
                ) : histories.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <NotFound />
                    </td>
                  </tr>
                ) : (
                  histories.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>{item.depositor?.username}</td>
                      <td>{item.telco}</td>
                      <td>{formatCurrency(item.amount)}</td>
                      <td>{formatCurrency(item.real_amount)}</td>
                      <td>{item.pin}</td>
                      <td>{item.serial}</td>
                      <td>
                        {item.status === "success" ? (
                          <span className="badges status-success">
                            Thành công
                          </span>
                        ) : item.status === "pending" ? (
                          <span className="badges bg-warning text-dark">
                            Đang xử lý
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

export default CardTopUpHistory;
