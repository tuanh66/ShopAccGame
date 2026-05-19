import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);
      localStorage.setItem("logged_in", "true");
      fetchMe().then(() => {
        toast.success("Đăng nhập thành công!");
        navigate("/");
      });
    } else {
      toast.error("Đăng nhập thất bại!");
      navigate("/");
    }
  }, [searchParams, setAccessToken, fetchMe, navigate]);


  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;
