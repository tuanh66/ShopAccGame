import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { historyService } from "@/service/historyService";
import { formatDate, formatCurrency } from "@/utils/format";
import NotFound from "@/components/common/NotFound";
import search from "@/assets/svg/search.svg";

const RandomAccountsHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistories = async (search = "") => {
    try {
      const res =
        await historyService.readRandomAccountsBoughtHistoryAdmin(search);
      setHistories(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử:", error);
      toast.error("Không thể lấy dữ liệu lịch sử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>LỊCH SỬ MUA RANDOM ACCOUNTS </h4>
          <span>Xem lịch sử mua random accounts của người dùng</span>
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
              placeholder="Tìm kiếm theo ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người mua</th>
                  <th>Tài khoản</th>
                  <th>Danh mục</th>
                  <th>Bậc</th>
                  <th>Giá</th>
                  <th>Lấy mật khẩu</th>
                  <th>Trạng thái</th>
                  <th>Thời gian mua</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : histories.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <NotFound />
                    </td>
                  </tr>
                ) : (
                  histories.map((item) => (
                    <tr key={item.historyAccountId}>
                      <td>#{item.historyAccountId}</td>
                      <td>{item.buyerName}</td>
                      <td>{item.gameUsername || "N/A"}</td>
                      <td>{item.categoryName}</td>
                      <td>
                        {item.tier === "thuong"
                          ? "Thường"
                          : item.tier === "ngon"
                            ? "Ngon"
                            : "Siêu phẩm"}
                      </td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>
                        <span
                          className={`badges ${item.passwordStatus ? "status-success" : "status-error"}`}
                        >
                          {item.passwordStatus ? "Đã lấy" : "Chưa lấy"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badges ${item.status ? "status-success" : "status-error"}`}
                        >
                          {item.status ? "Thành công" : "Thất bại"}
                        </span>
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RandomAccountsHistory;