import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/client/profile.css";
import anhdaidien from "../../assets/svg/anhdaidien.svg";
import thongtintaikhoan from "../../assets/svg/thongtintaikhoan.svg";
import eye_show from "../../assets/svg/eye-show.svg";
import eye_hide from "../../assets/svg/eye-hide.svg";
import doimatkhau from "../../assets/svg/doimatkhau.svg";
import dichvudamua from "../../assets/svg/dichvudamua.svg";
import sidebar_logout from "../../assets/svg/log-out.svg";
import sidebar_arrow_right from "../../assets/svg/sidebar_arrow_right.svg";

export default function ThongTin() {
  const { userInfo } = useOutletContext();
  const userId = userInfo?.id ?? "";
  const userName = userInfo?.username ?? "";
  const userBalance = userInfo?.balance
    ? Number(userInfo.balance).toLocaleString("vi-VN")
    : "0";
  const [activeHistory, setActiveHistory] = useState(1);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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
                <div className="sidebar-section-info-title text-[15px] text-[var(--text-title-color)]">
                  {userName}
                </div>
                <div className="sidebar-section-info-title text-[13px] text-[var(--text-color)]">
                  Số dư:{" "}
                  <span className="text-[var(--primary-color)]">
                    {userBalance}đ
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
                      {userId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar-section">
              <p className="sidebar-section-title">MENU TÀI KHOẢN</p>
              <div
                className={`sidebar-item ${
                  activeHistory === 1 ? "active" : ""
                }`}
                onClick={() => setActiveHistory(1)}
              >
                <div className="flex items-center">
                  <div className="sidebar-item-icon">
                    <img src={thongtintaikhoan} alt="" />
                  </div>
                  <p className="sidebar-item-text ">Thông tin tài khoản</p>
                  <img src={sidebar_arrow_right} alt="" />
                </div>
              </div>
              <div className="sidebar-item-partition"></div>
              <div
                className={`sidebar-item ${
                  activeHistory === 2 ? "active" : ""
                }`}
                onClick={() => setActiveHistory(2)}
              >
                <div className="flex items-center">
                  <div className="sidebar-item-icon">
                    <img src={doimatkhau} alt="" />
                  </div>
                  <p className="sidebar-item-text ">Đổi mật khẩu</p>
                  <img src={sidebar_arrow_right} alt="" />
                </div>
              </div>
            </div>
            <div className="sidebar-section">
              <p className="sidebar-section-title">MENU GIAO DỊCH</p>
              <div
                className={`sidebar-item ${
                  activeHistory === 3 ? "active" : ""
                }`}
                onClick={() => setActiveHistory(3)}
              >
                <a href="#" className="flex items-center">
                  <div className="sidebar-item-icon">
                    <img src={dichvudamua} alt="" />
                  </div>
                  <p className="sidebar-item-text ">Lịch sử giao dịch</p>
                  <img src={sidebar_arrow_right} alt="" />
                </a>
              </div>
              <div className="sidebar-item-partition"></div>
              <div
                className={`sidebar-item ${
                  activeHistory === 4 ? "active" : ""
                }`}
                onClick={() => setActiveHistory(4)}
              >
                <a href="#" className="flex items-center">
                  <div className="sidebar-item-icon">
                    <img src={dichvudamua} alt="" />
                  </div>
                  <p className="sidebar-item-text ">Dịch vụ đã mua</p>
                  <img src={sidebar_arrow_right} alt="" />
                </a>
              </div>
            </div>
            <div className="sidebar-section">
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
        <div className="history-right">
          <div className="history-detail-title">
            <h1>Thông tin tài khoản</h1>
          </div>
          <div className="history-detail-content">
            <div className="history-detail-attr">
              <p className="text-[var(--text-link)]">ID của bạn</p>
              <p className="font-medium">{userId}</p>
            </div>
            <div className="history-detail-attr">
              <p className="text-[var(--text-link)]">Tên tài khoản</p>
              <p className="font-medium">{userName}</p>
            </div>
            <div className="history-detail-attr">
              <p className="text-[var(--text-link)]">Số dư tài khoản</p>
              <p className="text-[var(--primary-color)] font-medium">
                {userBalance}đ
              </p>
            </div>
            <div className="flex items-center mt-3">
              <form className="flex w-full">
                <input type="text" placeholder="Nhập mã giới thiệu" />
                <button type="submit" className="btn ml-4">
                  Gửi
                </button>
              </form>
              <p className="form-message hidden"></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
