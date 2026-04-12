import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useLogin from "../hook/auth/useLogin";
import useRegister from "../hook/auth/useRegister";
import {
  FaFacebookF,
  FaYoutube,
  FaTelegram,
  FaDiscord,
  FaTiktok,
  FaAngleRight,
  FaPhone,
  FaEnvelope,
  FaCommentDots,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { FaHeadset, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { HiOutlineChevronRight } from "react-icons/hi";
import { GoBell, GoHistory } from "react-icons/go";
import { LuUserRound } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { CiLock } from "react-icons/ci";
import { TbLogout2 } from "react-icons/tb";
import logo from "../assets/img/logo.png";
import anhdaidien from "../assets/svg/anhdaidien.svg";
import facebook from "../assets/svg/logo_facebook.svg";
import googole from "../assets/svg/logo_google.svg";
import discord from "../assets/svg/logo_discord.svg";
import zalo from "../assets/svg/logo_zalo.svg";
import home from "../assets/svg/home.svg";
import top1 from "../assets/svg/top1.svg";
import homeCheck from "../assets/svg/homecheck.svg";
import gaming from "../assets/svg/gaming.svg";
import news from "../assets/svg/news.svg";
import amex from "../assets/svg/amex.svg";
import mastercard from "../assets/svg/mastercard.svg";
import paypal from "../assets/svg/paypal.svg";
import visa from "../assets/svg/visa.svg";

const ClientLayout = () => {
  // Xử lý mở tắt modal
  const showModalLogin = useAuthStore((s) => s.showLoginModal);
  const setShowModalLogin = useAuthStore((s) => s.setShowLoginModal);
  const [showBoxAccount, setShowBoxAccount] = useState(false);
  const [registerActive, setRegisterActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordRegisterConfirm, setShowPasswordRegisterConfirm] =
    useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const close = () => {
    setShowEffect(false);
    setTimeout(() => {
      setShowModalLogin(false);
    }, 300);
  };
  useEffect(() => {
    if (showModalLogin) {
      setTimeout(() => {
        setShowEffect(true);
        setRegisterActive(false);
        setShowPassword(false);
        setShowPasswordRegister(false);
        setShowPasswordRegisterConfirm(false);
      }, 10);
    }
  }, [showModalLogin]);
  // End Xử lý mở tắt modal

  // Xử lý đăng nhập, đăng ký
  const user = useAuthStore((s) => s.user);
  const refresh = useAuthStore((s) => s.refresh);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    const logged = localStorage.getItem("logged_in");
    if (logged) {
      refresh();
    }
  }, []);
  const {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    validateLoginField,
    serverLoginError,
    loginErrors,
    setLoginErrors,
  } = useLogin();
  const {
    regUsername,
    setRegUsername,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    regPasswordConfirm,
    setRegPasswordConfirm,
    handleRegister,
    validateRegisterField,
    registerErrors,
    setRegisterErrors,
    serverRegisterError,
  } = useRegister();

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut();
    setShowBoxAccount(false);
  };

  const formatMoney = (value) => {
    const num = value ?? 0;

    if (num < 1_000_000) {
      return new Intl.NumberFormat("vi-VN").format(num) + "đ";
    }

    const million = Math.floor(num / 1_000_000);
    const thousand = Math.floor((num % 1_000_000) / 1000);

    if (thousand === 0) return `${million}tr`;

    return `${million}tr${thousand}`;
  };

  // End Xử lý đăng nhập, đăng ký

  return (
    <>
      <div className="header">
        <div className="header-top container c-container">
          <div className="header-logo">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <div className="header-menu">
            <div className="header-menu-item mr-16">
              <div className="header-menu-icon mr-8">
                <FaHeadset />
              </div>
              <Link to="/cong-tac-vien" className="header-menu-link">
                Cộng tác viên
              </Link>
            </div>
            <div className="header-menu-item">
              <div className="header-menu-icon mr-8">
                <FaRegEye />
              </div>
              <Link to="/da-xem" className="header-menu-link">
                Đã xem
              </Link>
            </div>
          </div>
          <div className="header-search d-none d-lg-block">
            <form className="search-form">
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
            <Link
              to="/nap-tien"
              className="header-actions-recharge btn primary mr-16 d-none d-lg-block"
            >
              Nạp tiền
            </Link>
            <div className="header-actions-notification">
              <div className="header-menu-icon">
                <GoBell />
                {/* <p className="notification-count">0</p> */}
              </div>
            </div>
            <div className="header-actions-user relative d-none d-lg-block">
              {!user ? (
                <div
                  className="header-menu-icon ml-16"
                  onClick={() => setShowModalLogin(true)}
                >
                  <LuUserRound />
                </div>
              ) : (
                <div
                  className="d-flex ml-16 cursor-pointer"
                  onClick={() => setShowBoxAccount(!showBoxAccount)}
                >
                  <div className="account-name">
                    <div className="text-right title-color fz-13 fw-500">
                      {user.username}
                    </div>
                    <div className="fz-13 fw-400">
                      Số dư: {formatMoney(user.balance)}
                    </div>
                  </div>
                  <div className="account-avatar ml-12">
                    <img src={anhdaidien} alt="avatar" />
                  </div>
                </div>
              )}
              {showModalLogin && (
                <>
                  <div
                    className={`modal fade ${showEffect ? "show" : ""}`}
                    style={{
                      display: showModalLogin ? "block" : "none",
                    }}
                    onClick={close}
                  >
                    <div
                      className="modal-dialog"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content">
                        <div
                          className={`modal-login-container ${registerActive ? "right-panel-active" : ""}`}
                        >
                          <div className="modal-login-form-container sign-up-container">
                            <IoClose onClick={close} />
                            <form className="modal-login-form formRegister">
                              <p className="modal-title">Đăng ký</p>
                              <small className="modal-subtitle">
                                Vui lòng đăng nhập để sử dụng dịch vụ của chúng
                                tôi
                              </small>
                              <p className="form-message-error"></p>
                              <div className="input-group mt-12">
                                <input
                                  type="text"
                                  name="username"
                                  placeholder="Nhập tên tài khoản"
                                  className="modal-input-username"
                                />
                                <p className="form-message-error"></p>
                              </div>
                              <div className="input-group mt-12">
                                <input
                                  type="email"
                                  name="username"
                                  placeholder="Nhập email"
                                  className="modal-input-username"
                                />
                                <p className="form-message-error"></p>
                              </div>
                              <div className="input-group mt-12">
                                <input
                                  type={
                                    showPasswordRegister ? "text" : "password"
                                  }
                                  name="password"
                                  className="modal-input-password pr-32"
                                  placeholder="Nhập mật khẩu"
                                />
                                {showPasswordRegister ? (
                                  <FaRegEyeSlash
                                    onClick={() =>
                                      setShowPasswordRegister(false)
                                    }
                                  />
                                ) : (
                                  <FaRegEye
                                    onClick={() =>
                                      setShowPasswordRegister(true)
                                    }
                                  />
                                )}
                                <p className="form-message-error"></p>
                              </div>
                              <div className="input-group mt-12">
                                <input
                                  type={
                                    showPasswordRegisterConfirm
                                      ? "text"
                                      : "password"
                                  }
                                  name="password"
                                  className="modal-input-password pr-32"
                                  placeholder="Nhập lại mật khẩu"
                                />
                                {showPasswordRegisterConfirm ? (
                                  <FaRegEyeSlash
                                    onClick={() =>
                                      setShowPasswordRegisterConfirm(false)
                                    }
                                  />
                                ) : (
                                  <FaRegEye
                                    onClick={() =>
                                      setShowPasswordRegisterConfirm(true)
                                    }
                                  />
                                )}
                                <p className="form-message-error"></p>
                              </div>
                              <button
                                type="submit"
                                className="btn pink mt-32 w-100"
                              >
                                Đăng ký
                              </button>
                            </form>
                          </div>
                          <div className="modal-login-form-container sign-in-container">
                            <form
                              className="modal-login-form"
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const ok = await handleLogin();
                                if (ok) {
                                  close();
                                }
                              }}
                            >
                              <p className="modal-title">Đăng nhập</p>
                              <small className="modal-subtitle mb-12">
                                Vui lòng đăng ký để sử dụng dịch vụ của chúng
                                tôi
                              </small>
                              <p
                                className={`form-message-error ${
                                  serverLoginError ? "" : "hidden"
                                }`}
                              >
                                {serverLoginError}
                              </p>
                              <div className="input-group mt-12">
                                <input
                                  type="text"
                                  name="username"
                                  placeholder="Nhập tên tài khoản"
                                  className={`modal-input-username ${
                                    loginErrors.username ? "input-error" : ""
                                  }`}
                                  value={username}
                                  onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (loginErrors.username) {
                                      setLoginErrors((prev) => ({
                                        ...prev,
                                        username: "",
                                      }));
                                    }
                                  }}
                                  onBlur={() =>
                                    validateLoginField("username", username)
                                  }
                                />
                                <p className="form-message-error">
                                  {loginErrors.username}
                                </p>
                              </div>
                              <div className="input-group mt-12">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  placeholder="Nhập mật khẩu"
                                  className={`modal-input-password pr-32 ${
                                    loginErrors.password ? "input-error" : ""
                                  }`}
                                  value={password}
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (loginErrors.password) {
                                      setLoginErrors((prev) => ({
                                        ...prev,
                                        password: "",
                                      }));
                                    }
                                  }}
                                  onBlur={() =>
                                    validateLoginField("password", password)
                                  }
                                />
                                {showPassword ? (
                                  <FaRegEyeSlash
                                    onClick={() => setShowPassword(false)}
                                  />
                                ) : (
                                  <FaRegEye
                                    onClick={() => setShowPassword(true)}
                                  />
                                )}
                                <p className="form-message-error">
                                  {loginErrors.password}
                                </p>
                              </div>
                              <button
                                type="submit"
                                className="btn primary mt-32 w-100"
                              >
                                Đăng nhập
                              </button>
                              <span className="login-via mt-24 fz-13 fw-400 relative">
                                Hoặc đăng nhập qua
                              </span>
                              <div className="d-flex justify-content-center ">
                                <div className="social-container mt-24">
                                  <Link to="#">
                                    <img src={facebook} alt="login-facebook" />
                                  </Link>
                                </div>
                                <div className="social-container mt-24">
                                  <Link to="#">
                                    <img src={googole} alt="login-facebook" />
                                  </Link>
                                </div>
                                <div className="social-container mt-24">
                                  <Link to="#">
                                    <img src={discord} alt="login-facebook" />
                                  </Link>
                                </div>
                                <div className="social-container mt-24">
                                  <Link to="#">
                                    <img src={zalo} alt="login-facebook" />
                                  </Link>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className="modal-login-overlay-container">
                            <div className="modal-login-overlay">
                              <div className="modal-login-overlay-panel modal-login-overlay-left">
                                <p className="modal-panel-title">
                                  <span>Tuấn Phương</span> xin chào
                                </p>
                                <p className="fz-13 fw-400 mb-32">
                                  Bạn đã có tài khoản, vui lòng đăng nhập tại
                                  đây
                                </p>
                                <button
                                  onClick={() => setRegisterActive(false)}
                                  className="btn primary w-100 fz-16 fw-600"
                                >
                                  Đăng ký
                                </button>
                              </div>
                              <div className="modal-login-overlay-panel modal-login-overlay-right">
                                <IoClose onClick={close} />
                                <p className="modal-panel-title">
                                  <span>Tuấn Phương</span> xin chào
                                </p>
                                <p className="fz-13 fw-400 mb-32">
                                  Vui lòng đăng ký tại đây
                                </p>
                                <button
                                  onClick={() => setRegisterActive(true)}
                                  className="btn pink w-100 fz-16 fw-600"
                                >
                                  Đăng ký
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`modal-backdrop fade ${showEffect ? "show" : ""}`}
                  ></div>
                </>
              )}
              {showBoxAccount && (
                <div className="box-account-logined">
                  <div className="d-flex justify-content-between mb-18">
                    <p className="title-color fz-20 fw-700 mr-12 cursor-pointer">
                      Tài khoản
                    </p>
                    <IoClose
                      className="fz-24 text-title cursor-pointer mr-12"
                      onClick={() => setShowBoxAccount(false)}
                    />
                  </div>
                  <div className="box-account-content">
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
                              {new Intl.NumberFormat("vi-VN").format(
                                user?.balance,
                              )}
                              đ
                            </span>
                          </div>
                          <div className="fz-13 fw-500 text-color mb-4">
                            Số dư Acoin:{" "}
                            <span className="text-primary">0 Acoin</span>
                          </div>
                          <div className="fz-13 fw-500 text-color mb-4">
                            Số dư khuyến mãi:{" "}
                            <span className="text-primary">0đ</span>
                            <div className="fz-13 fw-500 text-color mb-4">
                              ID:{" "}
                              <span className="text-primary">{user?.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sidebar-section">
                        <p className="fz-15 fw-500 title-color mb-16">
                          MENU TÀI KHOẢN
                        </p>
                        <div className="sidebar-item">
                          <Link
                            to="/admin"
                            className="d-flex align-items-center"
                          >
                            <div className="sidebar-item-icon">
                              <PiUserCircleLight className="fz-24 title-color" />
                            </div>
                            <p className="sidebar-item-text fz-12 fw-400">
                              Vào trang Admin
                            </p>
                            <HiOutlineChevronRight className="fz-20 text-link" />
                          </Link>
                        </div>
                        <div className="sidebar-item-partition"></div>
                        <div className="sidebar-item">
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
                        <div className="sidebar-item">
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
                        <p className="fz-15 fw-500 title-color mb-16">
                          MENU GIAO DỊCH
                        </p>
                        <div className="sidebar-item">
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
                        <div className="sidebar-item">
                          <Link to="#" className="d-flex align-items-center">
                            <div className="sidebar-item-icon">
                              <GoHistory className="fz-24 title-color" />
                            </div>
                            <p className="sidebar-item-text fz-12 fw-400">
                              Dịch vụ đã mua
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
                            <p className="sidebar-item-text fz-12 fw-400">
                              Đăng xuất
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="header-bot">
          <div className="container c-container">
            <Link to="/" className="header-bot-item">
              <img src={home} alt="" />
              <span className="text-primary fz-15 fw-500 lh-24">Trang Chủ</span>
            </Link>
            <Link to="/cay-thue" className="header-bot-item">
              <img src={top1} alt="" />
              <span className="text-primary fz-15 fw-500 lh-24">Cày Thuê</span>
            </Link>
            <Link to="/mua-acc" className="header-bot-item">
              <img src={homeCheck} alt="" />
              <span className="text-primary fz-15 fw-500 lh-24">Mua Acc</span>
            </Link>
            <Link to="/dich-vu" className="header-bot-item">
              <img src={gaming} alt="" />
              <span className="text-primary fz-15 fw-500 lh-24">Dịch Vụ</span>
            </Link>
            <Link to="/tin-tuc" className="header-bot-item">
              <img src={news} alt="" />
              <span className="text-primary fz-15 fw-500 lh-24">Tin Tức</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="container c-container">
        <Outlet />
      </div>
      <div className="footer">
        <div className="container c-container">
          <div className="footer-content">
            <div className="footer-column">
              <Link to="/" className="footer-logo">
                <img src={logo} alt="logo" />
              </Link>
              <p className="footer-desc">
                Shop Ngọc Rồng Online cung cấp tài khoản game chính hãng, giá
                tốt nhất thị trường. Giao dịch an toàn, nhanh chóng và bảo mật
              </p>
              <div className="footer-social">
                <Link to="#" className="footer-social-link">
                  <FaFacebookF className="fz-16 text-white" />
                </Link>
                <Link to="#" className="footer-social-link">
                  <FaYoutube className="fz-16 text-white" />
                </Link>
                <Link to="#" className="footer-social-link">
                  <FaTelegram className="fz-16 text-white" />
                </Link>
                <Link to="#" className="footer-social-link">
                  <FaDiscord className="fz-16 text-white" />
                </Link>
                <Link to="#" className="footer-social-link">
                  <FaTiktok className="fz-16 text-white" />
                </Link>
              </div>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Liên Kết Nhanh</h3>
              <ul className="footer-links">
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Trang Chủ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Mua Tài Khoản
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Dịch Vụ Game
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Vòng Quay May Mắn
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Hỗ Trợ Khách Hàng</h3>
              <ul className="footer-links">
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Hướng Dẫn Mua Hàng
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Chính Sách Bảo Mật
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Điều Khoản Sử Dụng
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    <FaAngleRight color="currentColor" />
                    Liên Hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Thông Tin Liên Hệ</h3>
              <ul className="footer-contact">
                <li className="contact-item">
                  <div className="contact-item-icon">
                    <FaPhone className="fz-14 text-white" />
                  </div>
                  <span>Hotline: 0702.775.297</span>
                </li>
                <li className="contact-item">
                  <div className="contact-item-icon">
                    <FaEnvelope className="fz-14 text-white" />
                  </div>
                  <span>Email: tnquanganh@gmail.com</span>
                </li>
                <li className="contact-item">
                  <div className="contact-item-icon">
                    <FaCommentDots className="fz-14 text-white" />
                  </div>
                  <span>Zalo: 0702.775.297</span>
                </li>
                <li className="contact-item">
                  <div className="contact-item-icon">
                    <FaMapMarkerAlt className="fz-14 text-white" />
                  </div>
                  <span>Địa chỉ: TP.Đà Nẵng, Việt Nam</span>
                </li>
                <li className="contact-item">
                  <div className="contact-item-icon">
                    <FaClock className="fz-14 text-white" />
                  </div>
                  <span>Giờ làm việc: 8:00 - 22:00</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-payment">
              <img
                src={amex}
                alt="American Express"
                className="footer-payment-img"
              />
              <img
                src={mastercard}
                alt="American Express"
                className="footer-payment-img"
              />
              <img
                src={paypal}
                alt="American Express"
                className="footer-payment-img"
              />
              <img
                src={visa}
                alt="American Express"
                className="footer-payment-img"
              />
            </div>
            <div className="footer-copyright">
              © 2026 - Bản quyền thuộc về <Link to="/">TUANPHUONG.VN</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLayout;
