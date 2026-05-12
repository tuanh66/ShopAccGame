import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { historyService } from "../../service/historyService";
import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
import { CgRedo } from "react-icons/cg";
import search from "../../assets/svg/search.svg";

import { formatDate, formatCurrency } from "../../utils/format";

const TaiKhoanDaMua = () => {
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await historyService.readAccountsBoughtHistory();
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

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h1 className="fz-20 fw-700 lh-28 text-title">Tài khoản đã mua</h1>
        <span
          className="reload-page"
          onClick={fetchHistory}
          style={{ cursor: "pointer" }}
        >
          <CgRedo />
          Làm mới
        </span>
      </div>
      <div className="card-body px-16 py-16 d-flex flex-column">
        <div className="d-none d-lg-flex justify-content-between align-items-center mb-16">
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
            Object.entries(groupedTransactions).map(([monthYear, items]) => (
              <div key={monthYear} className="mb-24">
                <div className="fz-15 fw-500 lh-24 mb-12">{monthYear}</div>
                <ul className="trans-list">
                  {items.map((item) => (
                    <li className="trans-item" key={item._id}>
                      <Link
                        to={`/profile/tai-khoan-da-mua/${item.accountId?.accountsId}`}
                      >
                        <div className="text-left">
                          <span className="fw-500 title-color text-limit limit-1 bread-word">
                            {item.categoriesId?.name} (#
                            {item.accountId?.accountsId})
                          </span>
                          <span className="text-link">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="fz-13 fw-500 text-color d-block">
                            {formatCurrency(item.price)}
                          </span>
                          <span className={item.status ? "text-green" : "text-red"}>
                            {item.status ? "Thành công" : "Thất bại"}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaiKhoanDaMua;
