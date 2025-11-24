import { Outlet } from "react-router-dom";
import "../assets/css/client.css";
import logo from "../assets/img/logo.png";
import support from "../assets/svg/support.svg";
import viewed from "../assets/svg/viewed.svg";
import ring from "../assets/svg/ring.svg";
import profile from "../assets/svg/profile.svg";
import home from "../assets/svg/home.svg";
import top1 from "../assets/svg/top1.svg";
import homeCheck from "../assets/svg/homecheck.svg";
import gaming from "../assets/svg/gaming.svg";
import news from "../assets/svg/news.svg";
import logo_facebook from "../assets/svg/logo_facebook.svg";
import logo_zalo from "../assets/svg/logo_zalo.svg";
import logo_tiktok from "../assets/svg/logo_tiktok.svg";
import logo_telegram from "../assets/svg/logo_telegram.svg";

function ClientLayout() {
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-top container">
          <div className="header-logo">
            <a href="/">
              <img src={logo} alt="logo" />
            </a>
          </div>
          <div className="header-menu">
            <div className="header-menu-item mr-16">
              <div className="header-menu-icon">
                <img src={support} alt="icon" />
              </div>
              <a href="/cong-tac-vien" className="header-menu-link">
                Cộng tác viên
              </a>
            </div>
            <div className="header-menu-item">
              <div className="header-menu-icon">
                <img src={viewed} alt="icon" />
              </div>
              <a href="/da-xem" className="header-menu-link">
                Đã xem
              </a>
            </div>
          </div>
          <div className="header-search">
            <form action="" className="search-form">
              <input
                className="search-form-input"
                type="search"
                placeholder="Tìm kiếm"
              />
              <button className="search-form-btn" type="submit"></button>
              <div></div>
            </form>
          </div>
          <div className="header-actions">
            <a href="/nap-tien" className="header-actions-recharge btn">
              Nạp tiền
            </a>
            <div className="header-actions-notification">
              <div className="header-menu-icon m-0">
                <img src={ring} alt="icon" />
                <p className="notification-count">0</p>
              </div>
              {/* code sau */}
            </div>
            <div className="header-actions-user">
              <div className="header-menu-icon m-0">
                <img src={profile} alt="icon" />
              </div>
              {/* code sau */}
            </div>
          </div>
        </div>
        <div className="header-bot">
          <div className="container">
            <a href="/" className="header-bot-item">
              <img className="pr-1 w-6" src={home} alt="" />
              <span className="text-[15px] font-medium leading-normal">Trang Chủ</span>
            </a>
            <a href="/cay-thue" className="header-bot-item">
              <img className="pr-1 w-6" src={top1} alt="" />
              <span className="text-[15px] font-medium leading-normal">Cày Thuê</span>
            </a>
            <a href="/mua-acc" className="header-bot-item">
              <img className="pr-1 w-6" src={homeCheck} alt="" />
              <span className="text-[15px] font-medium leading-normal">Mua Acc</span>
            </a>
            <a href="/dich-vu" className="header-bot-item">
              <img className="pr-1 w-6" src={gaming} alt="" />
              <span className="text-[15px] font-medium leading-normal">Dịch Vụ</span>
            </a>
            <a href="/tin-tuc" className="header-bot-item">
              <img className="pr-1 w-6" src={news} alt="" />
              <span className="text-[15px] font-medium leading-normal">Tin Tức</span>
            </a>
          </div>
        </div>
      </header>
      {/* End Header */}
      <div className="container">
        <Outlet />
      </div>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-top-container container">
            <div className="col-30 mb-20 px-10">
              <div className="header-logo mb-15">
                <img src={logo} alt="logo" />
              </div>
              <div className="fz-15 fw-400 lh-20 text-justify">
                Shop Tuấn Phương – Chuyên mua bán acc Liên Quân Mobile uy tín,
                chất lượng. Cam kết tài khoản thật 100%, hỗ trợ tận tâm và bảo
                hành đầy đủ cho anh em game thủ.
              </div>
            </div>
            <div className="col-20 mb-20 px-10">
              <h4 className="footer-title">Lưu ý cần biết</h4>
              <ul className="footer-list">
                <li className="footer-item py-5">
                  <a href="#" className="fz-15 fw-400 text-color">
                    Kiểm tra uy tín của các shop
                  </a>
                </li>
                <li className="footer-item py-5">
                  <a href="#" className="fz-15 fw-400 text-color">
                    Đấu trường danh vọng
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-20 mb-20 px-10">
              <h4 className="footer-title">Hướng dẫn</h4>
              <ul className="footer-list">
                <li className="footer-item py-5">
                  <a href="#" className="fz-15 fw-400 text-color">
                    Quyền lợi khi mua acc
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-30 mb-20 px-10">
              <h4 className="footer-title">Kết nối với chúng tôi</h4>
              <div className="footer-social d-flex">
                <a href="#" className="mx-5">
                  <img
                    className="w-35 h-35"
                    src={logo_facebook}
                    alt="facebook"
                  />
                </a>
                <a href="#" className="mx-5">
                  <img className="w-35 h-35" src={logo_zalo} alt="zalo" />
                </a>
                <a href="#" className="mx-5">
                  <img className="w-35 h-35" src={logo_tiktok} alt="tiktok" />
                </a>
                <a href="#" className="mx-5">
                  <img
                    className="w-35 h-35"
                    src={logo_telegram}
                    alt="telegram"
                  />
                </a>
              </div>
              <div className="footer-info">
                <p className="text-color fz-15 fw-400">
                  👉Hotline CSKH: <span className="fw-700">0702775297</span>
                </p>
                <p className="text-color fz-15 fw-400">
                  👉Thời gian CSKH: <span className="fw-700">9h - 23h30</span>
                </p>
                <p className="text-color fz-15 fw-400">
                  👉Thành viên shop: <span className="fw-700">84.528</span>
                </p>
                <p className="text-color fz-15 fw-400">
                  👉Acc đã giao dịch: <span className="fw-700">84.528</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bot">
          <p className="text-heading fz-15 fw-400 lh-20">
            © Bản quyền thuộc về{" "}
            <span className="fw-700">Tuấn Phương | 15/05/2025</span>
          </p>
        </div>
      </footer>
      {/* End Footer */}
    </>
  );
}

export default ClientLayout;
