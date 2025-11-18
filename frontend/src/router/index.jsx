import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import ClientLayout from "../layout/ClientLayout";
// Admin
import Dashboard from "../components/Admin/Dashboard";
// Client
import TrangChu from "../components/Client/TrangChu";
import MuaAccount from "../components/Client/MuaAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <TrangChu /> },
      { path: "mua-account", element: <MuaAccount /> },
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
