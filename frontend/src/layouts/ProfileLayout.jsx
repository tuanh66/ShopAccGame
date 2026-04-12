import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import "../assets/profile.css";
import anhdaidien from "../assets/svg/anhdaidien.svg";
import { HiOutlineChevronRight } from "react-icons/hi";
import { GoHistory } from "react-icons/go";
import { PiUserCircleLight, PiUserCircleCheck } from "react-icons/pi";
import { CiLock } from "react-icons/ci";
import { TbLogout2 } from "react-icons/tb";

const ProfileLayout = () => {
  const user = useAuthStore((s) => s.user);

  // handleLogout
  const signOut = useAuthStore((s) => s.signOut);
  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut();
  };
  // End handleLogout

  // Xử lý cho active css
  const location = useLocation();
  const breadcrumbMap = {
    "/profile/thong-tin": "Thông tin tài khoản",
    "/profile/doi-mat-khau": "Đổi mật khẩu",
    "/profile/lich-su-giao-dich": "Lịch sử giao dịch",
    "/profile/tai-khoan-da-mua": "Tài khoản đã mua",
  };
  const currentLabel = breadcrumbMap[location.pathname];
  // Xử lý cho active css

  return (
    <>
      <div className="container-profile">
        <ul className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link to="/" className="breadcrumb-link">
              Trang chủ
            </Link>
          </li>
          <li className="breadcrumb-item">
            <span className="breadcrumb-link active">{currentLabel}</span>
          </li>
        </ul>
        <div className="row">
          <div className="history-left">
            <div className="sidebar">
              <div className="sidebar-section d-flex">
                <div className="sidebar-section-avatar">
                  <img src={anhdaidien} alt="icon" />
                </div>
                <div className="sidebar-section-info">
                  <div className="fz-15 fw-500 text-title mb-4">
                    {user?.username}
                  </div>
                  <div className="fz-13 fw-500 text-color mb-4">
                    Số dư:{" "}
                    <span className="text-primary">
                      {new Intl.NumberFormat("vi-VN").format(user?.balance)}đ
                    </span>
                  </div>
                  <div className="fz-13 fw-500 text-color mb-4">
                    Số dư Acoin: <span className="text-primary">0 Acoin</span>
                  </div>
                  <div className="fz-13 fw-500 text-color mb-4">
                    Số dư khuyến mãi: <span className="text-primary">0đ</span>
                    <div className="fz-13 fw-500 text-color mb-4">
                      ID: <span className="text-primary">{user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sidebar-section">
                <p className="fz-15 fw-500 title-color mb-16">MENU TÀI KHOẢN</p>
                <div
                  className={`sidebar-item ${
                    location.pathname === "/profile/thong-tin" ? "active" : ""
                  }`}
                >
                  <Link
                    to="/profile/thong-tin"
                    className="d-flex align-items-center"
                  >
                    <div className="sidebar-item-icon">
                      <PiUserCircleLight className="fz-24 title-color" />
                    </div>
                    <p className="sidebar-item-text fz-12 fw-400">
                      Thông tin tài khoản
                    </p>
                    <HiOutlineChevronRight className="fz-20 text-link" />
                  </Link>
                </div>
                <div className="sidebar-item-partition"></div>
                <div
                  className={`sidebar-item ${
                    location.pathname === "/profile/doi-mat-khau"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="/profile/doi-mat-khau"
                    className="d-flex align-items-center"
                  >
                    <div className="sidebar-item-icon">
                      <CiLock className="fz-24 title-color" />
                    </div>
                    <p className="sidebar-item-text fz-12 fw-400">
                      Đổi mật khẩu
                    </p>
                    <HiOutlineChevronRight className="fz-20 text-link" />
                  </Link>
                </div>
              </div>
              <div className="sidebar-section">
                <p className="fz-15 fw-500 title-color mb-16">MENU GIAO DỊCH</p>
                <div
                  className={`sidebar-item ${
                    location.pathname === "/profile/lich-su-giao-dich"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="/profile/lich-su-giao-dich"
                    className="d-flex align-items-center"
                  >
                    <div className="sidebar-item-icon">
                      <GoHistory className="fz-24 title-color" />
                    </div>
                    <p className="sidebar-item-text fz-12 fw-400">
                      Lịch sử giao dịch
                    </p>
                    <HiOutlineChevronRight className="fz-20 text-link" />
                  </Link>
                </div>
                <div className="sidebar-item-partition"></div>
                <div
                  className={`sidebar-item ${
                    location.pathname === "/profile/tai-khoan-da-mua"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="/profile/tai-khoan-da-mua"
                    className="d-flex align-items-center"
                  >
                    <div className="sidebar-item-icon">
                      <PiUserCircleCheck className="fz-24 title-color" />
                    </div>
                    <p className="sidebar-item-text fz-12 fw-400">
                      Tài khoản đã mua
                    </p>
                    <HiOutlineChevronRight className="fz-20 text-link" />
                  </Link>
                </div>
              </div>
              <div className="sidebar-section" onClick={handleLogout}>
                <div className="sidebar-item">
                  <Link to="#" className="d-flex align-items-center">
                    <div className="sidebar-item-icon">
                      <TbLogout2 className="fz-24 title-color" />
                    </div>
                    <p className="sidebar-item-text fz-12 fw-400">Đăng xuất</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="history-right">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
