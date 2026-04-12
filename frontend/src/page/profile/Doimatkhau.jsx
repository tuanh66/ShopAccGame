import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Doimatkhau = () => {
  const [showOldPassword, setShowOldPassword] = useState();
  const [showNewPassword, setShowNewPassword] = useState();
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState();

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="fz-20 fw-700 lh-28 text-title">Đổi mật khẩu</h1>
      </div>
      <div className="card-body px-16 pt-16 pb-0">
        <form className="form-password-change">
          <div className="input-group mb-8">
            <label htmlFor="oldPassword" className="fw-500 text-title mb-4">
              Mật khẩu cũ
            </label>
            <div className="w-100 relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                className="pr-44"
              />
              {showOldPassword ? (
                <FaRegEye onClick={() => setShowOldPassword(false)} />
              ) : (
                <FaRegEyeSlash onClick={() => setShowOldPassword(true)} />
              )}
            </div>
            <p className="form-message-error">ban da sai</p>
          </div>
          <div className="input-group mb-8">
            <label htmlFor="newPassword" className="fw-500 text-title mb-4">
              Mật khẩu mới
            </label>
            <div className="w-100 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className="pr-44"
              />
              {showNewPassword ? (
                <FaRegEye onClick={() => setShowNewPassword(false)} />
              ) : (
                <FaRegEyeSlash onClick={() => setShowNewPassword(true)} />
              )}
            </div>
          </div>
          <div className="input-group mb-8">
            <label
              htmlFor="newPasswordConfirm"
              className="fw-500 text-title mb-4"
            >
              Xác nhận
            </label>
            <div className="w-100 relative">
              <input
                type={showNewPasswordConfirm ? "text" : "password"}
                id="newPasswordConfirm"
                className="pr-44"
              />
              {showNewPasswordConfirm ? (
                <FaRegEye onClick={() => setShowNewPasswordConfirm(false)} />
              ) : (
                <FaRegEyeSlash
                  onClick={() => setShowNewPasswordConfirm(true)}
                />
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end my-24">
            <button className="btn primary w-30">Đổi mật khẩu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Doimatkhau;
