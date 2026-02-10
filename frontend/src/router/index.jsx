import { createBrowserRouter } from "react-router-dom";
import ProtectedClientRoute from "../router/ProtectedClientRoute";
import AdminLayout from "../layout/AdminLayout";
import ClientLayout from "../layout/ClientLayout";
import MobileLayout from "../layout/MobileLayout";
// Admin
import Dashboard from "../components/Admin/Dashboard";
// Client
import TrangChu from "../components/Client/TrangChu";
import MuaAcc from "../components/Client/MuaAcc";
import Profile from "../components/Client/Profile";
import DichVu from "../components/Client/DichVu";
import DanhSachAccount from "../components/Client/DanhSachAccount";
import ChiTietAccount from "../components/Client/ChiTietAccount";
import NapTien from "../components/Client/NapTien";
import ThongTin from "../components/Client/ThongTin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <TrangChu /> },
      {
        element: <MobileLayout />,
        children: [
          { path: "mua-acc", element: <MuaAcc /> },
          { path: "mua-acc/:slugCategory", element: <DanhSachAccount /> },
          {
            path: "mua-acc/:slugCategory/:slugDetail",
            element: <ChiTietAccount />,
          },
        ],
      },
      {
        path: "dich-vu",
        element: <DichVu />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
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
