import { Outlet } from "react-router-dom";
import "../assets/css/client.css";
import logo from "../assets/img/logo.png";
import viewed from "../assets/img/viewed.png";
import ring from "../assets/svg/ring.svg";
import profile from "../assets/svg/profile.svg";
import home from "../assets/img/home.png";

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
                <img src="" alt="icon" />
              </div>
              <a href="#" className="header-menu-link">
                Bảo hành
              </a>
            </div>
            <div className="header-menu-item">
              <div className="header-menu-icon">
                <img className="header-viewed" src={viewed} alt="icon" />
              </div>
              <a href="#" className="header-menu-link">
                Đã xem
              </a>
            </div>
          </div>
          <div className="header-search">
            <form action="" className="search-form">
              <input className="search-form-input" type="search" />
              <button className="search-form-btn" type="submit"></button>
              <div></div>
            </form>
          </div>
          <div className="header-actions">
            <a href="#" className="header-actions-recharge btn">
              Nạp tiền
            </a>
            <div class="header-actions-notification">
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
              <img className="pr-4 w-24" src={home} alt="" />
              <span className="fz-15 fw-500 lh-24">Trang Chủ</span>
            </a>
            <a href="/" className="header-bot-item">
              <img className="pr-4 w-24" src={home} alt="" />
              <span className="fz-15 fw-500 lh-24">...</span>
            </a>
            <a href="/" className="header-bot-item">
              <img className="pr-4 w-24" src={home} alt="" />
              <span className="fz-15 fw-500 lh-24">Mua Acc</span>
            </a>
            <a href="/" className="header-bot-item">
              <img className="pr-4 w-24" src={home} alt="" />
              <span className="fz-15 fw-500 lh-24">Dịch Vụ</span>
            </a>
            <a href="/" className="header-bot-item">
              <img className="pr-4 w-24" src={home} alt="" />
              <span className="fz-15 fw-500 lh-24">Tin Tức</span>
            </a>
          </div>
        </div>
      </header>
      {/* End Header */}
      <div className="container h-full">
        <Outlet />
      </div>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-top container">
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
            <div className="footer-social">
              <a href="">
                <img src="" alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bot">
          <p className="fz-15 fw-400 lh-20">
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
