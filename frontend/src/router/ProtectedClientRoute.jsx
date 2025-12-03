import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken"); // kiểm tra token
  const location = useLocation();

  if (!token) {
    // lưu trang mà user đang muốn vào
    localStorage.setItem("redirectTo", location.pathname);

    return <Navigate to="/" replace />;
  }

  return children; // đã đăng nhập -> cho vào
}
