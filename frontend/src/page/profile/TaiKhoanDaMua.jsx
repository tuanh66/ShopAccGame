import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { historyService } from "../../service/historyService";
import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
import { CgRedo } from "react-icons/cg";
import search from "../../assets/svg/search.svg";

const TaiKhoanDaMua = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await historyService.readAccountsBoughtHistory();
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử mua acc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNotFoundText("Bạn chưa mua tài khoản nào");
    fetchHistory();
  }, []);

  // Nhóm theo tháng
  const groupByMonth = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = new Date(item.updatedAt);
      const key = `Tháng ${date.getMonth() + 1} / ${date.getFullYear()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const groupedData = groupByMonth(data);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h1 className="fz-20 fw-700 lh-28 text-title">Tài khoản đã mua</h1>
        <span className="reload-page" onClick={fetchHistory} style={{ cursor: "pointer" }}>
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

        {loading ? (
          <div className="text-center py-40">Đang tải...</div>
        ) : data.length === 0 ? (
          <NotFound className="flex-grow-1" />
        ) : (
          <div className="history-content">
            {Object.entries(groupedData).map(([month, items]) => (
              <div key={month} className="mb-24">
                <div className="fz-15 fw-500 lh-24 mb-12">{month}</div>
                <ul className="trans-list">
                  {items.map((item) => (
                    <li className="trans-item" key={item._id}>
                      <Link to={`/profile/tai-khoan-da-mua/${item.accountId?.accountsId}`}>
                        <div className="text-left">
                          <span className="fw-500 title-color text-limit limit-1 bread-word">
                            {item.categoriesId?.name} (#{item.accountId?.accountsId})
                          </span>
                          <span className="text-link">
                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="fz-13 fw-500 text-color d-block">
                            {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                          </span>
                          <span className="text-green">
                            {item.status === "success" ? "Thành công" : item.status}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaiKhoanDaMua;