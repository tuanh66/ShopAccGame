import { useState } from "react";
import { authService } from "../../service/authService";
import toast from "react-hot-toast";

export default function useRegister() {
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  const [serverRegisterError, setServerRegisterError] = useState("");

  const [registerErrors, setRegisterErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  // ================= VALIDATE =================

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

    return (
      regUsername.trim() &&
      /^\S+@\S+\.\S+$/.test(regEmail) &&
      regPassword.trim() &&
      regPasswordConfirm.trim() &&
      regPassword === regPasswordConfirm
    );
  };

  // ================= REGISTER =================

  const handleRegister = async () => {
    const ok = validateRegisterAll();
    if (!ok) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return false;
    }

    setServerRegisterError("");

    try {
      const res = await authService.signUp(
        regUsername,
        regPassword,
        regEmail,
        regPasswordConfirm,
      );
      toast.success(res.message || "Đăng ký tài khoản thành công!");
      return true; // đăng ký thành công
    } catch (error) {
      const errMsg = error.response?.data?.message || "Đăng ký thất bại";
      setServerRegisterError(errMsg);
      toast.error(errMsg);
      return false;
    }
  };

  // ================= RETURN =================

  return {
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
  };
}
