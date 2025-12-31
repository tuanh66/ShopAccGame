import { createBrowserRouter } from "react-router-dom";
import ProtectedClientRoute from "../router/ProtectedClientRoute";
import AdminLayout from "../layout/AdminLayout";
import ClientLayout from "../layout/ClientLayout";
// Admin
import Dashboard from "../components/Admin/Dashboard";
// Client
import TrangChu from "../components/Client/TrangChu";
import MuaAcc from "../components/Client/MuaAcc";
import NapTien from "../components/Client/NapTien";
import ThongTin from "../components/Client/ThongTin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <TrangChu /> },
      { path: "mua-acc", element: <MuaAcc /> },
      {
        path: "nap-tien",
        element: (
          <ProtectedClientRoute>
            <NapTien />
          </ProtectedClientRoute>
        ),
      },
      {
        path: "thong-tin",
        element: (
          <ProtectedClientRoute>
            <ThongTin />
          </ProtectedClientRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
]);

export default router;
