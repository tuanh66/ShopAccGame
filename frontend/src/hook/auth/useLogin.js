import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function useLogin() {
  const signIn = useAuthStore((state) => state.signIn);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverLoginError, setServerLoginError] = useState("");

  const [loginErrors, setLoginErrors] = useState({
    username: "",
    password: "",
  });

  // ================= VALIDATE =================

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

  // ================= LOGIN =================

  const handleLogin = async () => {
    const ok = validateLoginAll();
    if (!ok) return false;

    try {
      await signIn(username, password);
      setServerLoginError("");
      return true;
    } catch (error) {
      if (error.response?.data?.message) {
        setServerLoginError(error.response.data.message);
      } else {
        setServerLoginError("Không thể kết nối tới server!");
      }
      return false;
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    validateLoginField,
    serverLoginError,
    setServerLoginError,
    loginErrors,
    setLoginErrors,
  };
}
