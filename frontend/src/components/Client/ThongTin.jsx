import "../../assets/css/client/thongtin.css";
import anhdaidien from "../../assets/svg/anhdaidien.svg";
import thongtintaikhoan from "../../assets/svg/thongtintaikhoan.svg";
import doimatkhau from "../../assets/svg/doimatkhau.svg";
// import sidebar_logout from "../../assets/svg/log-out.svg";
import sidebar_arrow_right from "../../assets/svg/sidebar_arrow_right.svg";

export default function ThongTin() {
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <a href="/" className="breadcrumb-link">
            Trang chủ
          </a>
        </li>
        <li className="breadcrumb-item">
          <a href="/thong-tin" className="breadcrumb-link">
            Thông tin tài khoản
          </a>
        </li>
      </ul>
      <div className="history-row">
        <div className="history-left">
          <div className="sidebar">
            <div className="sidebar-section flex">
              <div className="sidebar-section-avatar">
                <img src={anhdaidien} alt="icon" />
              </div>
              <div className="sidebar-section-info">
                <div className="sidebar-section-info-title text-[15px] text-[var(--title-color)]">
                  admin
                </div>
                <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                  Số dư: <span className="text-[var(--primary-color)]">0đ</span>
                </div>
                <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                  Số dư Acoin:{" "}
                  <span className="text-[var(--primary-color)]">0 Acoin</span>
                </div>
                <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                  Số dư khuyến mãi:{" "}
                  <span className="text-[var(--primary-color)]">0đ</span>
                  <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                    ID:{" "}
                    <span className="text-[var(--primary-color)]">2983929</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar-section">
              <p className="sidebar-section-title">MENU TÀI KHOẢN</p>
              <div className="sidebar-item">
                <a href="/thong-tin" className="flex items-center">
                  <div className="sidebar-item-icon">
                    <img src={thongtintaikhoan} alt="" />
                  </div>
                  <p className="sidebar-item-text ">Thông tin tài khoản</p>
                  <img src={sidebar_arrow_right} alt="" />
                </a>
              </div>
              <div className="sidebar-item-partition"></div>
              <div className="sidebar-item">
                <a href="#" className="flex items-center">
                  <div className="sidebar-item-icon">
                    <img src={doimatkhau} alt="" />
                  </div>
                  <p className="sidebar-item-text ">Đổi mật khẩu</p>
                  <img src={sidebar_arrow_right} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="history-right"></div>
      </div>
    </>
  );
}
