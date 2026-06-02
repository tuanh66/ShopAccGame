import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { discountCodeService } from "../../service/discountCodeService";
import search from "../../assets/svg/search.svg";
import icon_plus from "../../assets/svg/plus.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";
import NotFound from "../../components/common/NotFound";
import { useModal } from "../../hooks/useModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

const DiscountCode = () => {
  // Lấy danh sách mã giảm giá
  const { showModal, showEffect, openModal, closeModal } = useModal();
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await discountCodeService.readDiscountCode();
        setDiscountCodes(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
        toast.error("Không thể tải danh sách mã giảm giá");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xoá mã giảm giá
  const [deleteItem, setDeleteItem] = useState(null);
  const handleDelete = async () => {
    try {
      await discountCodeService.deleteDiscountCode(deleteItem._id);
      setDiscountCodes((prev) =>
        prev.filter((item) => item._id !== deleteItem._id),
      );
      close();
      toast.success(`Đã xoá mã giảm giá ${deleteItem.code} thành công`);
    } catch (error) {
      console.error("Lỗi xoá mã giảm giá", error);
      toast.error("Xoá mã giảm giá thất bại");
    }
  };

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = discountCodes.filter((item) =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Danh sách mã giảm giá</h4>
          <span>Quản lý mã giảm giá cho tài khoản và dịch vụ</span>
        </div>
        <div className="page-btn">
          <Link to="create" className="btn primary btn-added">
            <img src={icon_plus} alt="add" className=" me-1" />
            Thêm mã giảm giá
          </Link>
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
                  <th>Mã giảm giá</th>
                  <th>Kiểu</th>
                  <th>Giá trị</th>
                  <th>Lượt sử dụng còn lại</th>
                  <th>Hết hạn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <NotFound message="Không có dữ liệu" />
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={item._id}>
                      <td>{filtered.length - index}</td>
                      <td>{item.code}</td>
                      <td>
                        {item.type === "percent" ? "Phần trăm" : "Cố định"}
                      </td>
                      <td>
                        {item.type === "percent"
                          ? `${item.value}%`
                          : `${new Intl.NumberFormat("vi-VN").format(item.value)}đ`}
                      </td>
                      <td>
                        {item.maxUses === 0
                          ? "Không giới hạn"
                          : `${item.maxUses - (item.usedCount || 0)}`}
                      </td>
                      <td>
                        {item.expirationDate
                          ? new Date(item.expirationDate).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "Không hết hạn"}
                      </td>
                      <td>
                        <span
                          className={`badges ${item.status ? "status-success" : "status-error"}`}
                        >
                          {item.status ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Link to={`edit/${item._id}`}>
                            <img src={icon_edit} alt="edit" className="me-3" />
                          </Link>
                          <Link to="#">
                            <img
                              src={icon_delete}
                              alt="delete"
                              onClick={() => {
                                setDeleteItem(item);
                                openModal();
                              }}
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ConfirmDeleteModal
              show={showModal}
              showEffect={showEffect}
              onClose={closeModal}
              onConfirm={handleDelete}
              message="Bạn có chắc chắn muốn xoá mã giảm giá"
              itemName={deleteItem?.code}
            />
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

export default DiscountCode;
