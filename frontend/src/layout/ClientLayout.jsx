import axios from "axios";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "../assets/css/client.css";
import logo from "../assets/img/logo.png";
import support from "../assets/svg/support.svg";
import viewed from "../assets/svg/viewed.svg";
import ring from "../assets/svg/ring.svg";
import profile from "../assets/svg/profile.svg";
import eye_show from "../assets/svg/eye-show.svg";
import eye_hide from "../assets/svg/eye-hide.svg";
import profile_close from "../assets/svg/profile_close.svg";
import anhdaidien from "../assets/svg/anhdaidien.svg";
import thongtintaikhoan from "../assets/svg/thongtintaikhoan.svg";
import doimatkhau from "../assets/svg/doimatkhau.svg";
import sidebar_logout from "../assets/svg/log-out.svg";
import sidebar_arrow_right from "../assets/svg/sidebar_arrow_right.svg";
import home from "../assets/svg/home.svg";
import top1 from "../assets/svg/top1.svg";
import homeCheck from "../assets/svg/homecheck.svg";
import gaming from "../assets/svg/gaming.svg";
import news from "../assets/svg/news.svg";
import logo_facebook from "../assets/svg/logo_facebook.svg";
import logo_zalo from "../assets/svg/logo_zalo.svg";
import logo_tiktok from "../assets/svg/logo_tiktok.svg";
import logo_telegram from "../assets/svg/logo_telegram.svg";
import logo_discord from "../assets/svg/logo_discord.svg";
import logo_google from "../assets/svg/logo_google.svg";
import icon_close from "../assets/svg/close.svg";

export default function ClientLayout() {
  const API = import.meta.env.VITE_API_URL;
  const [openModal, setOpenModal] = useState(false);
  const [openAccountBox, setOpenAccountBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordRegisterConfirm, setShowPasswordRegisterConfirm] =
    useState(false);
  const [registerActive, setRegisterActive] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const open = () => {
    setOpenModal(true); // render modal
  };
  const close = () => {
    setShowEffect(false); // bỏ class show -> fade-out
    setTimeout(() => {
      setOpenModal(false); // xoá modal khỏi DOM sau hiệu ứng
    }, 300); // đúng 300ms như Vue
  };

  useEffect(() => {
    if (openModal) {
      // giống watch(newVal === true)
      setTimeout(() => {
        setShowEffect(true);
        setRegisterActive(false);
        setShowPassword(false);
      }, 10);
    }
  }, [openModal]); // watch openModal

  // HANDLE REGISTER
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [serverRegisterError, setServerRegisterError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const ok = validateRegisterAll();
    if (!ok) return;

    try {
      await axios.post(`${API}/auth/signup`, {
        username: regUsername,
        email: regEmail,
        password: regPassword,
        password_confirmation: regPasswordConfirm,
      });

      setServerRegisterError("");
      // Nếu thành công
      alert("Đăng ký thành công!");
      setRegisterActive(false); // chuyển sang login
    } catch (error) {
      if (error.response) {
        const res = error.response.data;

        // Laravel validation error dạng:
        // { errors: { email: ["Email đã tồn tại"], username: [...] } }
        if (res.errors) {
          // Lấy lỗi đầu tiên
          const firstError = Object.values(res.errors)[0][0];
          setServerRegisterError(firstError);
        } else {
          // Lỗi dạng message
          setServerRegisterError(res.message || "Đăng ký thất bại");
        }
      } else {
        setServerRegisterError("Không thể đăng ký!");
      }
    }
  };

  const [registerErrors, setRegisterErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const validateRegisterField = (field, value) => {
    let message = "";

    switch (field) {
      case "username":
        if (!value.trim()) message = "Bạn chưa nhập tên tài khoản";
        else if (value.trim().length < 4)
          message = "Tên tài khoản phải có ít nhất 4 ký tự";
        break;

      case "email":
        if (!value.trim()) message = "Bạn chưa nhập email";
        else if (!/^\S+@\S+\.\S+$/.test(value))
          message = "Email của bạn không hợp lệ";
        break;

      case "password":
        if (!value.trim()) message = "Bạn chưa nhập mật khẩu";
        else if (value.trim().length < 6)
          message = "Mật khẩu phải có ít nhất 6 ký tự";
        break;

      case "password_confirm":
        if (!value.trim()) message = "Bạn chưa nhập mật khẩu xác nhận";
        else if (value !== regPassword)
          message = "Mật khẩu xác nhận không trùng khớp";
        break;
    }

    setRegisterErrors((prev) => ({ ...prev, [field]: message }));
  };

  const validateRegisterAll = () => {
    validateRegisterField("username", regUsername);
    validateRegisterField("email", regEmail);
    validateRegisterField("password", regPassword);
    validateRegisterField("password_confirm", regPasswordConfirm);

    // Nếu còn lỗi -> return false
    return (
      regUsername.trim() &&
      /^\S+@\S+\.\S+$/.test(regEmail) &&
      regPassword.trim() &&
      regPasswordConfirm.trim() &&
      regPassword === regPasswordConfirm
    );
  };
  // END HANDLE REGISTER

  // HANDLE LOGIN
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverLoginError, setServerLoginError] = useState("");

  const [userInfo, setUserInfo] = useState(null); // lưu thông tin user
  // const [loginErrors, setLoginErrors] = useState({
  //   username: "",
  //   password: "",
  // });

  const handleLogin = async (e) => {
    e.preventDefault();

    const ok = validateLoginAll();
    if (!ok) return;

    try {
      const res = await axios.post(`${API}/auth/signin`, {
        username,
        password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);

      const me = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${res.data.accessToken}` },
      });
      setUserInfo(me.data.user);

      setOpenModal(false);
    } catch (error) {
      if (error.response) {
        const res = error.response.data;

        if (res.errors) {
          // Lấy lỗi đầu tiên
          const firstError = Object.values(res.errors)[0][0];
          setServerLoginError(firstError);
        } else {
          // Lỗi dạng message
          setServerLoginError(res.message || "Đăng ký thất bại");
        }
      } else {
        setServerLoginError("Không thể đăng ký!");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get(`${API}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setUserInfo(res.data.user))
      .catch(() => localStorage.removeItem("accessToken"));

    const redirectTo = localStorage.getItem("redirectTo");
    if (redirectTo) {
      localStorage.removeItem("redirectTo");
      window.location.href = redirectTo; // redirect ở đây là ok
    }
  }, []);

  const [loginErrors, setLoginErrors] = useState({
    username: "",
    password: "",
  });

  const validateLoginField = (field, value) => {
    let message = "";

    switch (field) {
      case "username":
        if (!value.trim()) message = "Bạn chưa nhập tên tài khoản";
        break;

      case "password":
        if (!value.trim()) message = "Bạn chưa nhập mật khẩu";
        break;
    }

    setLoginErrors((prev) => ({ ...prev, [field]: message }));
  };
  const validateLoginAll = () => {
    validateLoginField("username", username);
    validateLoginField("password", password);

    return username.trim() && password.trim();
  };
  // END HANDLE LOGIN

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      // 1. Gọi API backend để xoá refresh token + cookie
      await axios.post(`${API}/auth/signout`, {}, { withCredentials: true });

      // 2. Xoá accessToken bên client
      localStorage.removeItem("accessToken");

      // 3. Xoá thông tin user
      setUserInfo(null);

      // 4. Đóng box tài khoản
      setOpenAccountBox(false);
    } catch (error) {
      console.error("Logout lỗi:", error);
    }
  };
  // END HANDLE LOGOUT
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
            <div className="header-menu-item mr-4">
              <div className="header-menu-icon mr-2">
                <img src={support} alt="icon" />
              </div>
              <a href="/cong-tac-vien" className="header-menu-link">
                Cộng tác viên
              </a>
            </div>
            <div className="header-menu-item">
              <div className="header-menu-icon mr-2">
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
            <a href="/nap-tien" className="header-actions-recharge btn mr-4">
              Nạp tiền
            </a>
            <div className="header-actions-notification">
              <div className="header-menu-icon">
                <img src={ring} alt="icon" />
                <p className="notification-count">0</p>
              </div>
              {/* code sau */}
            </div>
            <div className="header-actions-user relative">
              {userInfo ? (
                <div
                  className="header-account-logined"
                  onClick={() => setOpenAccountBox(!openAccountBox)}
                >
                  <div className="header-account-name">
                    <div className="text-[var(--text-title-color)] text-right font-medium">
                      {userInfo.username}
                    </div>
                    <div className="font-normal">
                      Số dư:{" "}
                      {new Intl.NumberFormat("vi-VN").format(userInfo.balance)}
                    </div>
                  </div>
                  <div className="header-account-avatar">
                    <img src={anhdaidien} alt="avatar" />
                  </div>
                </div>
              ) : (
                <div className="header-menu-icon ml-4" onClick={open}>
                  <img src={profile} alt="icon" />
                </div>
              )}
              {openModal && (
                <div
                  className={`modal fade ${showEffect ? "show" : ""}`}
                  onClick={close}
                >
                  <div className="modal-dialog">
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={`modal-login-container ${
                          registerActive ? "right-panel-active" : ""
                        }`}
                      >
                        <div className="modal-login-form-container sign-up-container">
                          <img onClick={close} src={icon_close} alt="icon" />
                          <form
                            className="modal-login-form formRegister"
                            onSubmit={handleRegister}
                          >
                            <p className="modal-title">Đăng ký</p>
                            <small className="modal-subtitle">
                              Vui lòng đăng nhập để sử dụng dịch vụ của chúng
                              tôi
                            </small>
                            <p
                              className={`form-message ${
                                serverRegisterError ? "" : "hidden"
                              }`}
                            >
                              {serverRegisterError}
                            </p>
                            <div className="modal-input-group mt-3">
                              <input
                                type="text"
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
                                onBlur={() =>
                                  validateRegisterField("username", regUsername)
                                }
                              />
                              <p className="form-message">
                                {registerErrors.username}
                              </p>
                            </div>
                            <div className="modal-input-group mt-2">
                              <input
                                type="email"
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
                                onBlur={() =>
                                  validateRegisterField("email", regEmail)
                                }
                              />
                              <p className="form-message">
                                {registerErrors.email}
                              </p>
                            </div>
                            <div className="modal-input-group">
                              <div className="password-input-container">
                                <input
                                  type={
                                    showPasswordRegister ? "text" : "password"
                                  }
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
                                    validateRegisterField(
                                      "password",
                                      regPassword
                                    )
                                  }
                                />
                                {showPasswordRegister ? (
                                  <img
                                    src={eye_show}
                                    alt="show"
                                    className="password-input-hide"
                                    onClick={() =>
                                      setShowPasswordRegister(false)
                                    }
                                  />
                                ) : (
                                  <img
                                    src={eye_hide}
                                    alt="hide"
                                    className="password-input-show"
                                    onClick={() =>
                                      setShowPasswordRegister(true)
                                    }
                                  />
                                )}
                              </div>
                              <p className="form-message">
                                {registerErrors.password}
                              </p>
                            </div>
                            <div className="modal-input-group">
                              <div className="password-input-container">
                                <input
                                  type={
                                    showPasswordRegisterConfirm
                                      ? "text"
                                      : "password"
                                  }
                                  name="password"
                                  placeholder="Nhập mật khẩu của bạn"
                                  className={`modal-input modal-input-password !pr-9 ${
                                    registerErrors.password_confirm
                                      ? "input-error"
                                      : ""
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
                                      regPasswordConfirm
                                    )
                                  }
                                />
                                {showPasswordRegisterConfirm ? (
                                  <img
                                    src={eye_show}
                                    alt="show"
                                    className="password-input-hide"
                                    onClick={() =>
                                      setShowPasswordRegisterConfirm(false)
                                    }
                                  />
                                ) : (
                                  <img
                                    src={eye_hide}
                                    alt="hide"
                                    className="password-input-show"
                                    onClick={() =>
                                      setShowPasswordRegisterConfirm(true)
                                    }
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
                          </form>
                        </div>
                        <div className="modal-login-form-container sign-in-container">
                          <input type="hidden"></input>
                          <form
                            className="modal-login-form"
                            onSubmit={handleLogin}
                          >
                            <p className="modal-title">Đăng nhập</p>
                            <small className="modal-subtitle">
                              Vui lòng đăng ký để sử dụng dịch vụ của chúng tôi
                            </small>
                            <p
                              className={`form-message ${
                                serverLoginError ? "" : "hidden"
                              }`}
                            >
                              {serverLoginError}
                            </p>
                            <div className="modal-input-group">
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
                                onBlur={() =>
                                  validateLoginField("username", username)
                                }
                              />
                              <p className="form-message">
                                {loginErrors.username}
                              </p>
                            </div>
                            <div className="modal-input-group">
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
                                  onBlur={() =>
                                    validateLoginField("password", password)
                                  }
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
                              <p className="form-message">
                                {loginErrors.password}
                              </p>
                            </div>
                            <button type="submit" className="btn modal-btn">
                              Đăng nhập
                            </button>
                            <span className="modal-separator">
                              Hoặc đăng nhập qua
                            </span>
                            <div className="flex justify-center">
                              <div className="mt-6">
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
                          </form>
                        </div>
                        <div className="modal-login-overlay-container">
                          <div className="modal-login-overlay">
                            <div className="modal-login-overlay-panel modal-login-overlay-left">
                              <p className="modal-panel-title">
                                <span>Tuấn Phương</span> xin chào
                              </p>
                              <p className="modal-panel-subtext">
                                Bạn đã có tài khoản, vui lòng đăng nhập tại đây
                              </p>
                              <button
                                onClick={() => setRegisterActive(false)}
                                className="btn modal-login-overlay-btn"
                              >
                                Đăng ký
                              </button>
                            </div>
                            <div className="modal-login-overlay-panel modal-login-overlay-right">
                              <img
                                onClick={close}
                                src={icon_close}
                                alt="icon"
                                className="absolute top-4 right-4 cursor-pointer"
                              />
                              <p className="modal-panel-title">
                                <span>Tuấn Phương</span> xin chào
                              </p>
                              <p className="modal-panel-subtext">
                                Vui lòng đăng ký tại đây
                              </p>
                              <button
                                onClick={() => setRegisterActive(true)}
                                className="btn modal-login-overlay-btn"
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
              )}
              {openAccountBox && (
                <div className="box-account-logined">
                  <div className="box-account-title">
                    <div className="text-[var(--text-title-color)] text-[20px] font-bold leading-[28px]">
                      Tài khoản
                    </div>
                    <img
                      src={profile_close}
                      alt="icon"
                      onClick={() => setOpenAccountBox(false)}
                    />
                  </div>
                  <div className="box-account-content">
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
                              {new Intl.NumberFormat("vi-VN").format(
                                userInfo.balance
                              )}
                              đ
                            </span>
                          </div>
                          <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                            Số dư Acoin:{" "}
                            <span className="text-[var(--primary-color)]">
                              0 Acoin
                            </span>
                          </div>
                          <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                            Số dư khuyến mãi:{" "}
                            <span className="text-[var(--primary-color)]">
                              0đ
                            </span>
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
                          <a
                            href="admin/dashboard"
                            className="flex items-center"
                          >
                            <div className="sidebar-item-icon">
                              <img src={thongtintaikhoan} alt="" />
                            </div>
                            <p className="sidebar-item-text ">
                              Vào trang Admin
                            </p>
                            <img src={sidebar_arrow_right} alt="" />
                          </a>
                        </div>
                        <div className="sidebar-item-partition"></div>
                        <div className="sidebar-item">
                          <a href="/thong-tin" className="flex items-center">
                            <div className="sidebar-item-icon">
                              <img src={thongtintaikhoan} alt="" />
                            </div>
                            <p className="sidebar-item-text ">
                              Thông tin tài khoản
                            </p>
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
                      <div className="sidebar-section">
                        <p className="sidebar-section-title">MENU GIAO DỊCH</p>
                        <div className="sidebar-item">
                          <a href="#" className="flex items-center">
                            <div className="sidebar-item-icon">
                              <img src={thongtintaikhoan} alt="" />
                            </div>
                            <p className="sidebar-item-text ">
                              Lịch sử giao dịch
                            </p>
                            <img src={sidebar_arrow_right} alt="" />
                          </a>
                        </div>
                        <div className="sidebar-item-partition"></div>
                        <div className="sidebar-item">
                          <a href="#" className="flex items-center">
                            <div className="sidebar-item-icon">
                              <img src={doimatkhau} alt="" />
                            </div>
                            <p className="sidebar-item-text ">Dịch vụ đã mua</p>
                            <img src={sidebar_arrow_right} alt="" />
                          </a>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="header-bot">
          <div className="container">
            <a href="/" className="header-bot-item">
              <img className="pr-1 w-6" src={home} alt="" />
              <span className="text-[15px] font-medium leading-normal">
                Trang Chủ
              </span>
            </a>
            <a href="/cay-thue" className="header-bot-item">
              <img className="pr-1 w-6" src={top1} alt="" />
              <span className="text-[15px] font-medium leading-normal">
                Cày Thuê
              </span>
            </a>
            <a href="/mua-acc" className="header-bot-item">
              <img className="pr-1 w-6" src={homeCheck} alt="" />
              <span className="text-[15px] font-medium leading-normal">
                Mua Acc
              </span>
            </a>
            <a href="/dich-vu" className="header-bot-item">
              <img className="pr-1 w-6" src={gaming} alt="" />
              <span className="text-[15px] font-medium leading-normal">
                Dịch Vụ
              </span>
            </a>
            <a href="/tin-tuc" className="header-bot-item">
              <img className="pr-1 w-6" src={news} alt="" />
              <span className="text-[15px] font-medium leading-normal">
                Tin Tức
              </span>
            </a>
          </div>
        </div>
      </header>
      {/* End Header */}
      <div className="container">
        <Outlet context={{ userInfo, setUserInfo }} />
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
          <p className="text-[14px] font-normal leading-[20px] select-none">
            © Bản quyền thuộc về&nbsp;
            <span className="font-bold">Tuấn Phương | 15/05/2025</span>
          </p>
        </div>
      </footer>
      {/* End Footer */}
    </>
  );
}
