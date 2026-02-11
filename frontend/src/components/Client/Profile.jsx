import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/client/profile.css";
import useLogin from "../../hooks/auth/useLogin";
import useRegister from "../../hooks/auth/useRegister";
import Loading from "../..//components/common/Loading";
import logo from "../../assets/img/logo.png";
import login_robot from "../../assets/img/login-robot.png";
import anhdaidien from "../../assets/svg/anhdaidien.svg";
import thongtintaikhoan from "../../assets/svg/thongtintaikhoan.svg";
import doimatkhau from "../../assets/svg/doimatkhau.svg";
import dichvudamua from "../../assets/svg/dichvudamua.svg";
import sidebar_logout from "../../assets/svg/log-out.svg";
import sidebar_arrow_right from "../../assets/svg/sidebar_arrow_right.svg";
import eye_show from "../../assets/svg/eye-show.svg";
import eye_hide from "../../assets/svg/eye-hide.svg";
import logo_facebook from "../../assets/svg/logo_facebook.svg";
import logo_zalo from "../../assets/svg/logo_zalo.svg";
import logo_discord from "../../assets/svg/logo_discord.svg";
import logo_google from "../../assets/svg/logo_google.svg";

const Profile = () => {
  const API = import.meta.env.VITE_API_URL;
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordRegisterConfirm, setShowPasswordRegisterConfirm] =
    useState(false);
  const {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    loginErrors,
    setLoginErrors,
    validateLoginField,
    serverLoginError,
  } = useLogin(setUserInfo);
  const {
    regUsername,
    setRegUsername,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    regPasswordConfirm,
    setRegPasswordConfirm,
    serverRegisterError,
    registerErrors,
    setRegisterErrors,
    validateRegisterField,
    handleRegister,
  } = useRegister();

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      // 1. Gọi API backend để xoá refresh token + cookie
      await axios.post(`${API}/auth/signout`, {}, { withCredentials: true });

      // 2. Xoá accessToken bên client
      localStorage.removeItem("accessToken");

      // 3. Xoá thông tin user
      setUserInfo(null);
    } catch (error) {
      console.error("Logout lỗi:", error);
    }
  };
  // END HANDLE LOGOUT

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const isLoggedIn = !!userInfo;

  if (!isLoggedIn) {
    return (
      <>
        {loading && <Loading />}
        <div className="login-popup">
          <div className="login-popup-img m-auto">
            <img src={login_robot} alt="" />
          </div>
          <div className="login-popup-content ml-6">
            <div className="login-popup-title">Shop Tuấn Phương xin chào!</div>
            <div className="mt-1">
              Vui lòng đăng nhập để sử dụng dịch vụ của chúng tôi
            </div>
            <button
              className="btn w-full mt-3"
              onClick={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            >
              Đăng nhập
            </button>
            <div className="mt-[10px]">
              Bạn chưa có tài khoản?{" "}
              <a
                href=""
                className="font-medium text-[var(--primary-color)] underline"
                onClick={(e) => {
                  e.preventDefault();
                  setShowRegister(true);
                  setShowLogin(true);
                }}
              >
                Đăng ký
              </a>
            </div>
          </div>
        </div>
        <div className={`mobile-auth ${showLogin ? "active" : ""}`}>
          <div className="header-mobile">
            <button
              className="header-mobile-back"
              onClick={() => setShowLogin(false)}
            />
            <span className="header-mobile-title">
              {showRegister ? "Đăng ký" : "Đăng nhập"}
            </span>
          </div>
          <div className="mobile-auth-form">
            <form
              className={`mobile-auth-register ${showRegister ? "flex" : "hidden"}`}
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  await handleRegister();
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="mt-10">
                <img src={logo} alt="Logo" className="w-25 mx-auto" />
              </div>
              <small className="text-[15px] font-medium leading-[24px] mt-6 mb-5">
                Đăng ký để trải nghiệm tốt nhất
                <br />
                dịch vụ của chúng tôi!
              </small>
              <p
                className={`form-message mb-[20px] ${
                  serverRegisterError ? "" : "hidden"
                }`}
              >
                {serverRegisterError}
              </p>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Nhập tên tài khoản"
                  className={`modal-input modal-input-username ${
                    registerErrors.username ? "input-error" : ""
                  }`}
                  value={regUsername}
                  onChange={(e) => {
                    setRegUsername(e.target.value);
                    if (registerErrors.username) {
                      setRegisterErrors((prev) => ({
                        ...prev,
                        username: "",
                      }));
                    }
                  }}
                  onBlur={() => validateRegisterField("username", regUsername)}
                />
                <p className="form-message">{registerErrors.username}</p>
              </div>
              <div className="input-group mt-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  className={`modal-input modal-input-username ${
                    registerErrors.email ? "input-error" : ""
                  }`}
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (registerErrors.email) {
                      setRegisterErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                  }}
                  onBlur={() => validateRegisterField("email", regEmail)}
                />
                <p className="form-message">{registerErrors.email}</p>
              </div>
              <div className="input-group">
                <div className="password-input-container">
                  <input
                    type={showPasswordRegister ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu của bạn"
                    className={`modal-input modal-input-password !pr-9 ${
                      registerErrors.password ? "input-error" : ""
                    }`}
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (registerErrors.password) {
                        setRegisterErrors((prev) => ({
                          ...prev,
                          password: "",
                        }));
                      }
                    }}
                    onBlur={() =>
                      validateRegisterField("password", regPassword)
                    }
                  />
                  {showPasswordRegister ? (
                    <img
                      src={eye_show}
                      alt="show"
                      className="password-input-hide"
                      onClick={() => setShowPasswordRegister(false)}
                    />
                  ) : (
                    <img
                      src={eye_hide}
                      alt="hide"
                      className="password-input-show"
                      onClick={() => setShowPasswordRegister(true)}
                    />
                  )}
                </div>
                <p className="form-message">{registerErrors.password}</p>
              </div>
              <div className="input-group">
                <div className="password-input-container">
                  <input
                    type={showPasswordRegisterConfirm ? "text" : "password"}
                    name="passwordConfirm"
                    placeholder="Nhập mật khẩu của bạn"
                    className={`modal-input modal-input-password !pr-9 ${
                      registerErrors.password_confirm ? "input-error" : ""
                    }`}
                    value={regPasswordConfirm}
                    onChange={(e) => {
                      setRegPasswordConfirm(e.target.value);
                      if (registerErrors.password_confirm) {
                        setRegisterErrors((prev) => ({
                          ...prev,
                          password_confirm: "",
                        }));
                      }
                    }}
                    onBlur={() =>
                      validateRegisterField(
                        "password_confirm",
                        regPasswordConfirm,
                      )
                    }
                  />
                  {showPasswordRegisterConfirm ? (
                    <img
                      src={eye_show}
                      alt="show"
                      className="password-input-hide"
                      onClick={() => setShowPasswordRegisterConfirm(false)}
                    />
                  ) : (
                    <img
                      src={eye_hide}
                      alt="hide"
                      className="password-input-show"
                      onClick={() => setShowPasswordRegisterConfirm(true)}
                    />
                  )}
                </div>
                <p className="form-message">
                  {registerErrors.password_confirm}
                </p>
              </div>
              <button type="submit" className="btn modal-btn">
                Đăng ký
              </button>
              <p className="mt-4 text-[12px] leading-[16px]">
                Bạn đã có tài khoản?{" "}
                <span
                  className="text-[13px] text-[var(--primary-color)]"
                  onClick={() => setShowRegister(false)}
                >
                  Đăng nhập tại đây
                </span>
              </p>
            </form>
            <form
              className={`mobile-auth-login ${!showRegister ? "flex" : "hidden"}`}
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  await handleLogin();
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="mt-10">
                <img src={logo} alt="Logo" className="w-25 mx-auto" />
              </div>
              <small className="text-[15px] font-medium leading-[24px] mt-6 mb-5">
                Đăng nhập để tiến hành giao dịch!
              </small>
              <p
                className={`form-message mb-[20px] ${serverLoginError ? "" : "hidden"}`}
              >
                {serverLoginError}
              </p>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Nhập tên tài khoản"
                  className={`modal-input modal-input-username ${
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
                  onBlur={() => validateLoginField("username", username)}
                />
                <p className="form-message">{loginErrors.username}</p>
              </div>
              <div className="input-group">
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    className={`modal-input modal-input-password !pr-9 ${
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
                    onBlur={() => validateLoginField("password", password)}
                  />
                  {showPassword ? (
                    <img
                      src={eye_show}
                      alt="show"
                      className="password-input-show"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <img
                      src={eye_hide}
                      alt="hide"
                      className="password-input-hide"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                <p className="form-message">{loginErrors.password}</p>
              </div>
              <button type="submit" className="btn modal-btn">
                Đăng nhập
              </button>
              <div className="login-line">
                <span className="block"></span>
                <p className="mx-2 text-[var(--text-link)]">
                  Hoặc đăng nhập qua
                </p>
                <span className="block"></span>
              </div>
              <div className="flex justify-center">
                <div className="mt-4">
                  <a href="#" className="modal-social-link">
                    <img src={logo_facebook} alt="facebook" />
                  </a>
                  <a href="#" className="modal-social-link">
                    <img src={logo_discord} alt="facebook" />
                  </a>
                  <a href="#" className="modal-social-link">
                    <img src={logo_google} alt="facebook" />
                  </a>
                  <a href="#" className="modal-social-link">
                    <img src={logo_zalo} alt="facebook" />
                  </a>
                </div>
              </div>
              <p className="mt-4 text-[12px] leading-[16px]">
                Bạn chưa có tài khoản?{" "}
                <span
                  className="text-[13px] text-[var(--primary-color)]"
                  onClick={() => setShowRegister(true)}
                >
                  Đăng ký tại đây
                </span>
              </p>
            </form>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-section flex">
          <div className="sidebar-section-avatar">
            <img src={anhdaidien} alt="icon" />
          </div>
          <div className="sidebar-section-info">
            <div className="sidebar-section-info-title text-[15px] text-[var(--text-title-color)]">
              {userInfo.username}
            </div>
            <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
              Số dư:{" "}
              <span className="text-[var(--primary-color)]">
                {new Intl.NumberFormat("vi-VN").format(userInfo.balance)}đ
              </span>
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
                <span className="text-[var(--primary-color)]">
                  {userInfo.id}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-section-title">MENU TÀI KHOẢN</p>
          <div className="sidebar-item">
            <Link to="/thong-tin" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={thongtintaikhoan} alt="" />
              </div>
              <p className="sidebar-item-text ">Thông tin tài khoản</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/doi-mat-khau" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={doimatkhau} alt="" />
              </div>
              <p className="sidebar-item-text ">Đổi mật khẩu</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-section-title">MENU GIAO DỊCH</p>
          <div className="sidebar-item">
            <Link to="/lich-su-giao-dich" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Lịch sử giao dịch</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/dich-vu-da-mua" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Dịch vụ đã mua</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/dich-vu-da-mua" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Dịch vụ đã mua</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/dich-vu-da-mua" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Dịch vụ đã mua</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/dich-vu-da-mua" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Dịch vụ đã mua</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/dich-vu-da-mua" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Dịch vụ đã mua</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
          <div className="sidebar-item-partition"></div>
          <div className="sidebar-item">
            <Link to="/dich-vu-da-mua" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={dichvudamua} alt="" />
              </div>
              <p className="sidebar-item-text ">Dịch vụ đã mua</p>
              <img src={sidebar_arrow_right} alt="" />
            </Link>
          </div>
        </div>
        <div className="sidebar-section" onClick={handleLogout}>
          <div className="sidebar-item">
            <a href="#" className="flex items-center">
              <div className="sidebar-item-icon">
                <img src={sidebar_logout} alt="icon" />
              </div>
              <p className="sidebar-item-text">Đăng xuất</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
