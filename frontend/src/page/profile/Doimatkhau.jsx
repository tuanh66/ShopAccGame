import toast from "react-hot-toast";
import { useState } from "react";
import { authService } from "@/service/authService";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Doimatkhau = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const [changePasswordErrors, setChangePasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const validateChangePasswordField = (field, value) => {
    let message = "";

    switch (field) {
      case "oldPassword":
        if (!value.trim()) message = "Bạn chưa nhập mật khẩu cũ";
        break;
      case "newPassword":
        if (!value.trim()) message = "Bạn chưa nhập mật khẩu mới";
        else if (value.length < 6)
          message = "Mật khẩu mới phải có ít nhất 6 ký tự";
        break;
      case "newPasswordConfirm":
        if (!value.trim()) message = "Bạn chưa nhập xác nhận mật khẩu";
        else if (value !== newPassword)
          message = "Mật khẩu xác nhận không khớp";
        break;
    }

    setChangePasswordErrors((prev) => ({ ...prev, [field]: message }));
  };

  const validateChangePasswordAll = () => {
    validateChangePasswordField("oldPassword", oldPassword);
    validateChangePasswordField("newPassword", newPassword);
    validateChangePasswordField("newPasswordConfirm", newPasswordConfirm);

    return (
      oldPassword.trim() &&
      newPassword.trim() &&
      newPassword.length >= 6 &&
      newPasswordConfirm.trim() &&
      newPassword === newPasswordConfirm
    );
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const ok = validateChangePasswordAll();
    if (!ok) return;

    setLoading(true);
    try {
      const res = await authService.changePassword(
        oldPassword,
        newPassword,
        newPasswordConfirm,
      );
      toast.success(res.message);
      // Reset form
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setChangePasswordErrors({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi hệ thống";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="fz-20 fw-700 lh-28 text-title">Đổi mật khẩu</h1>
      </div>
      <div className="card-body px-16 pt-16 pb-0">
        <form className="form-password-change" onSubmit={handleChangePassword}>
          <div className="input-group mb-8">
            <label htmlFor="oldPassword" className="fw-500 text-title mb-4">
              Mật khẩu cũ
            </label>
            <div className="w-100 relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Nhập mật khẩu cũ"
                className={`pr-44 ${
                  changePasswordErrors.oldPassword ? "input-error" : ""
                }`}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (changePasswordErrors.oldPassword) {
                    setChangePasswordErrors((prev) => ({
                      ...prev,
                      oldPassword: "",
                    }));
                  }
                }}
                onBlur={() =>
                  validateChangePasswordField("oldPassword", oldPassword)
                }
              />
              {showOldPassword ? (
                <FaRegEye
                  className="eye-icon"
                  onClick={() => setShowOldPassword(false)}
                />
              ) : (
                <FaRegEyeSlash
                  className="eye-icon"
                  onClick={() => setShowOldPassword(true)}
                />
              )}
            </div>
            <p className="form-message-error">
              {changePasswordErrors.oldPassword}
            </p>
          </div>

          <div className="input-group mb-8">
            <label htmlFor="newPassword" className="fw-500 text-title mb-4">
              Mật khẩu mới
            </label>
            <div className="w-100 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Nhập mật khẩu mới"
                className={`pr-44 ${
                  changePasswordErrors.newPassword ? "input-error" : ""
                }`}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (changePasswordErrors.newPassword) {
                    setChangePasswordErrors((prev) => ({
                      ...prev,
                      newPassword: "",
                    }));
                  }
                }}
                onBlur={() =>
                  validateChangePasswordField("newPassword", newPassword)
                }
              />
              {showNewPassword ? (
                <FaRegEye
                  className="eye-icon"
                  onClick={() => setShowNewPassword(false)}
                />
              ) : (
                <FaRegEyeSlash
                  className="eye-icon"
                  onClick={() => setShowNewPassword(true)}
                />
              )}
            </div>
            <p className="form-message-error">
              {changePasswordErrors.newPassword}
            </p>
          </div>

          <div className="input-group mb-8">
            <label
              htmlFor="newPasswordConfirm"
              className="fw-500 text-title mb-4"
            >
              Xác nhận mật khẩu
            </label>
            <div className="w-100 relative">
              <input
                type={showNewPasswordConfirm ? "text" : "password"}
                id="newPasswordConfirm"
                placeholder="Nhập lại mật khẩu mới"
                className={`pr-44 ${
                  changePasswordErrors.newPasswordConfirm ? "input-error" : ""
                }`}
                value={newPasswordConfirm}
                onChange={(e) => {
                  setNewPasswordConfirm(e.target.value);
                  if (changePasswordErrors.newPasswordConfirm) {
                    setChangePasswordErrors((prev) => ({
                      ...prev,
                      newPasswordConfirm: "",
                    }));
                  }
                }}
                onBlur={() =>
                  validateChangePasswordField(
                    "newPasswordConfirm",
                    newPasswordConfirm,
                  )
                }
              />
              {showNewPasswordConfirm ? (
                <FaRegEye
                  className="eye-icon"
                  onClick={() => setShowNewPasswordConfirm(false)}
                />
              ) : (
                <FaRegEyeSlash
                  className="eye-icon"
                  onClick={() => setShowNewPasswordConfirm(true)}
                />
              )}
            </div>
            <p className="form-message-error">
              {changePasswordErrors.newPasswordConfirm}
            </p>
          </div>

          <div className="d-flex justify-content-end my-24">
            <button
              type="submit"
              className="btn primary w-30"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Doimatkhau;