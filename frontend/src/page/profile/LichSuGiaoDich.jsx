import { Link } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
import { CgRedo } from "react-icons/cg";
import search from "../../assets/svg/search.svg";

const LichSuGiaoDich = () => {
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);
  setNotFoundText("Không có giao dịch nào");
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h1 className="fz-20 fw-700 lh-28 text-title">Lịch sử giao dịch</h1>
        <span className="reload-page">
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
        {/* <NotFound className="flex-grow-1" /> */}
        <div className="history-content">
          <div className="fz-15 fw-500 lh-24 mb-12">Tháng 3</div>
          <ul className="trans-list">
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Mua tài khoản (#6307660)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-red d-block">-30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Nạp Ví - ATM tự động (#6307650)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-primary d-block">+30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
          </ul>
          <div className="fz-15 fw-500 lh-24 mb-12">Tháng 3</div>
          <ul className="trans-list">
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Mua tài khoản (#6307660)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-red d-block">-30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Nạp Ví - ATM tự động (#6307650)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-primary d-block">+30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
          </ul>
          <div className="fz-15 fw-500 lh-24 mb-12">Tháng 3</div>
          <ul className="trans-list">
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Mua tài khoản (#6307660)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-red d-block">-30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Nạp Ví - ATM tự động (#6307650)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-primary d-block">+30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
          </ul>
          <div className="fz-15 fw-500 lh-24 mb-12">Tháng 3</div>
          <ul className="trans-list">
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Mua tài khoản (#6307660)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-red d-block">-30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
            <li className="trans-item">
              <Link to="#">
                <div className="text-left">
                  <span className="fw-500 title-color text-limit limit-1 bread-word">
                    Nạp Ví - ATM tự động (#6307650)
                  </span>
                  <span className="text-link">25/03/2026 - 09:58</span>
                </div>
                <div className="text-right">
                  <span className="fw-500 text-primary d-block">+30.000đ</span>
                  <span className="text-green">Thành công</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LichSuGiaoDich;
