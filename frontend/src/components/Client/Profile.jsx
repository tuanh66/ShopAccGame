import { useOutletContext, Link } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/client/thongtin.css";
import anhdaidien from "../../assets/svg/anhdaidien.svg";
import thongtintaikhoan from "../../assets/svg/thongtintaikhoan.svg";
import doimatkhau from "../../assets/svg/doimatkhau.svg";
import dichvudamua from "../../assets/svg/dichvudamua.svg";
import sidebar_logout from "../../assets/svg/log-out.svg";
import sidebar_arrow_right from "../../assets/svg/sidebar_arrow_right.svg";

const Profile = () => {
  const { userInfo } = useOutletContext();
  const userId = userInfo?.id ?? "";
  const userName = userInfo?.username ?? "";
  const userBalance = userInfo?.balance
    ? Number(userInfo.balance).toLocaleString("vi-VN")
    : "0";
  return (
    <>
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
                <span className="text-[var(--primary-color)]">{userId}</span>
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
    </>
  );
};

export default Profile;
