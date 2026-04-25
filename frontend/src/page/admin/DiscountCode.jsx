import { Link } from "react-router-dom";
import search from "../../assets/svg/search.svg";
import icon_plus from "../../assets/svg/plus.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const DiscountCode = () => {
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
                <tr>
                  <td>1</td>
                </tr>
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

export default DiscountCode;
