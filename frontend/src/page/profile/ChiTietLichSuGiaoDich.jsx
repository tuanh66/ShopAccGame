import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { historyService } from "../../service/historyService";
import { useAuthStore } from "../../store/useAuthStore";

const ChiTietLichSuGiaoDich = () => {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await historyService.readUserTransactionHistoryById(id);
      setTransaction(res.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết giao dịch", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case "bankAccount":
        return "Nạp Ví - ATM tự động";
      case "buyAccount":
        return "Mua tài khoản";
      case "cardTopUp":
        return "Nạp Ví - Thẻ tự động";
      default:
        return "Giao dịch";
    }
  };

  if (loading) return <div className="text-center py-50">Đang tải...</div>;
  if (!transaction)
    return <div className="text-center py-50">Không tìm thấy giao dịch</div>;

  const isIncrease = ["bankAccount", "cardTopUp"].includes(
    transaction.transaction,
  );

  return (
    <div>
      <div className="history-detail-title brs-12 p-16 mb-16">
        <h1 className="fz-20 fw-700 lh-28 title-color">Chi tiết giao dịch</h1>
      </div>
      <div className="history-detail-content brs-12">
        <div className="history-detail-subtitle py-12 px-16 fz-15 fw-500 lh-24">
          {getTransactionTypeLabel(transaction.transaction)}
        </div>
        <div className="px-16 pb-24">
          <div className="history-detail-label fz-13 fw-500 py-12">
            Thông tin giao dịch
          </div>
          <div className="history-detail-info-block brs-12 p-16 mb-16">
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Số tiền giao dịch</p>
              <div className={`fz-13 fw-500 ${isIncrease ? "text-primary" : "text-red"}`}>
                {isIncrease ? "+" : "-"} {new Intl.NumberFormat("vi-VN").format(transaction.amount)}đ
              </div>
            </div>
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Số dư cuối</p>
              <div className="fz-13 fw-500">
                {new Intl.NumberFormat("vi-VN").format(transaction.balance_after)}đ
              </div>
            </div>
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Ngày giao dịch</p>
              <div className="fz-13 fw-500">{formatDate(transaction.createdAt)}</div>
            </div>
            <div className="history-detail-attr d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Trạng thái</p>
              <div className="fz-13 fw-500 text-green">Thành công</div>
            </div>
          </div>
          <div className="history-detail-info-block brs-12 p-16 mb-16">
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">ID</p>
              <div className="fz-13 fw-500">#{transaction.userHistoryId}</div>
            </div>
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Chủ tài khoản</p>
              <div className="fz-13 fw-500">{user?.username}</div>
            </div>
            <div className="history-detail-attr d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Loại giao dịch</p>
              <div className="fz-13 fw-500">{getTransactionTypeLabel(transaction.transaction)}</div>
            </div>
          </div>
          <div className="history-detail-info-block brs-12 p-16">
            <p className="text-link fz-13 fw-400 mb-16">Thông báo</p>
            <div className="fz-12 fw-400 pb-8">{transaction.description || "Không có thông báo"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiTietLichSuGiaoDich;
