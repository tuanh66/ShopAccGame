import { useState } from "react";
import axios from "axios";

export default function useRegister() {
  const API = import.meta.env.VITE_API_URL;

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
    if (!ok) return false;

    setServerRegisterError("");

    try {
      await axios.post(`${API}/auth/signup`, {
        username: regUsername,
        email: regEmail,
        password: regPassword,
        password_confirmation: regPasswordConfirm,
      });

      return true; // đăng ký thành công
    } catch (error) {
      if (error.response) {
        const res = error.response.data;

        if (typeof res === "object") {
          const firstError = Object.values(res)[0];
          setServerRegisterError(firstError);
        } else {
          setServerRegisterError(res.message || "Đăng ký thất bại");
        }
      } else {
        setServerRegisterError("Không thể đăng ký!");
      }

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
