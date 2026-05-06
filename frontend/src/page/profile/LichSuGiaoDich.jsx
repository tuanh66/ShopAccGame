import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
import { CgRedo } from "react-icons/cg";
import search from "../../assets/svg/search.svg";
import { historyService } from "../../service/historyService";

const LichSuGiaoDich = () => {
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await historyService.readUserTransactionHistory();
      setTransactions(res.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setNotFoundText("Không có giao dịch nào");
    fetchHistory();
  }, [fetchHistory, setNotFoundText]);

  // Nhóm giao dịch theo tháng
  const groupedTransactions = transactions.reduce((groups, trans) => {
    const date = new Date(trans.createdAt);
      const monthYear = `Tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(trans);
      return groups;
    }, {});

  const getTransactionLabel = (trans) => {
    const id = trans.userHistoryId || "";
    switch (trans.transaction) {
      case "bankAccount":
        return `Nạp Ví - ATM tự động (#${id})`;
      case "buyAccount":
        return `Mua tài khoản (#${id})`;
      case "cardTopUp":
        return `Nạp Ví - Thẻ tự động (#${id})`;
      default:
        return "";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h1 className="fz-20 fw-700 lh-28 text-title">Lịch sử giao dịch</h1>
        <span className="reload-page" onClick={fetchHistory}>
          <CgRedo />
          Làm mới
        </span>
      </div>
      <div className="card-body px-16 py-16 d-flex flex-column">
        <div className="d-none d-lg-flex justify-content-between align-items-center ">
          <form className="mobi-search w-40">
            <img src={search} alt="search" />
            <input
              type="text"
              className="search-form-input"
              placeholder="Tìm kiếm"
            />
          </form>
          <div className="value-filter">
            <div className="show-modal-filter">Bộ lọc</div>
          </div>
        </div>
        <div className="history-content">
          {loading ? (
            <div className="text-center py-20">Đang tải...</div>
          ) : transactions.length === 0 ? (
            <NotFound className="flex-grow-1" />
          ) : (
            Object.keys(groupedTransactions).map((monthYear) => (
              <div key={monthYear}>
                <div className="fz-15 fw-500 lh-24 mb-12">{monthYear}</div>
                <ul className="trans-list mb-24">
                  {groupedTransactions[monthYear].map((trans) => {
                    const isIncrease = ["bankAccount", "cardTopUp"].includes(
                      trans.transaction,
                    );
                    return (
                      <li className="trans-item" key={trans.userHistoryId}>
                        <Link
                          to={`/profile/lich-su-giao-dich/${trans.userHistoryId}`}
                        >
                          <div className="text-left">
                            <span className="fw-500 title-color text-limit limit-1 bread-word">
                              {getTransactionLabel(trans)}
                            </span>
                            <span className="text-link">
                              {formatDate(trans.createdAt)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`fw-500 ${isIncrease ? "text-primary" : "text-red"} d-block`}
                            >
                              {isIncrease ? "+" : "-"}
                              {new Intl.NumberFormat("vi-VN").format(
                                trans.amount,
                              )}
                              đ
                            </span>
                            <span className="text-green">Thành công</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LichSuGiaoDich;
