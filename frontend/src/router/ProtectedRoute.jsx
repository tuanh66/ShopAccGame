import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const refresh = useAuthStore((s) => s.refresh);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        await refresh();
      } else if (!user) {
        await fetchMe();
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="fui-loading-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // ❌ chưa login → 404
  if (!useAuthStore.getState().accessToken) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
