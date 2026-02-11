import { useState, useEffect } from "react";
import axios from "axios";

export default function useLogin(setUserInfo) {
  const API = import.meta.env.VITE_API_URL;

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
      const res = await axios.post(`${API}/auth/signin`, {
        username,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);

      const me = await axios.get(`${API}/users/me`, {
        headers: {
          Authorization: `Bearer ${res.data.accessToken}`,
        },
      });

      setUserInfo(me.data.user);

      return true;
    } catch (error) {
      if (error.response) {
        const res = error.response.data;

        if (res.errors) {
          const firstError = Object.values(res.errors)[0][0];
          setServerLoginError(firstError);
        } else {
          setServerLoginError(res.message || "Đăng nhập thất bại");
        }
      } else {
        setServerLoginError("Không thể đăng nhập!");
      }

      return false;
    }
  };

  // ================= AUTO LOAD USER =================

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get(`${API}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUserInfo(res.data.user))
      .catch(() => localStorage.removeItem("accessToken"));

    const redirectTo = localStorage.getItem("redirectTo");
    if (redirectTo) {
      localStorage.removeItem("redirectTo");
      window.location.href = redirectTo;
    }
  }, []);

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    loginErrors,
    setLoginErrors,
    validateLoginField,
    serverLoginError,
  };
}
