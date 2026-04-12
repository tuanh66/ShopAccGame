import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/client.css";
import "./assets/admin.css";
import Loading from "./components/common/Loading";
import ProtectedRoute from "./router/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useUIStore } from "./store/useUIStore";
// import Client
import ClientLayout from "./layouts/ClientLayout";
import TrangChu from "./page/client/TrangChu";
import MuaAcc from "./page/client/MuaAcc";
import DanhSachAccount from "./page/client/DanhSachAccount";
import ChitietAccount from "./page/client/ChitietAccount";
import DaXem from "./page/client/DaXem";
import NapTien from "./page/client/NapTien";
import NotFound from "./page/NotFound";
// import profile
import ProfileLayout from "./layouts/ProfileLayout";
import ThongTin from "./page/profile/ThongTin";
import DoiMatKhau from "./page/profile/Doimatkhau";
import LichSuGiaoDich from "./page/profile/LichSuGiaoDich";
import TaiKhoanDaMua from "./page/profile/TaiKhoanDaMua";
// import Admin
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import Categories from "./page/admin/Categories";
import CategoriesCreate from "./page/admin/CategoriesCreate";
import CategoriesEdit from "./page/admin/CategoriesEdit";
import Accounts from "./page/admin/Accounts";
import AccountsCreate from "./page/admin/AccountsCreate";
import AccountsEdit from "./page/admin/AccountsEdit";
import BankAccounts from "./page/admin/BankAccounts";
import BankAccountsHistory from "./page/admin/BankAccountsHistory";
import CardTopUp from "./page/admin/CardTopUp";
import CardTopUpHistory from "./page/admin/CardTopUpHistory";
import User from "./page/admin/Users";
import UserEdit from "./page/admin/UsersEdit";

function App() {
  const authLoading = useAuthStore((s) => s.loading);
  const globalLoading = useUIStore((s) => s.globalLoading);

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Loading loading={authLoading || globalLoading} />
        <Routes>
          {/* Client */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<TrangChu />} />
            <Route path="mua-acc">
              <Route index element={<MuaAcc />} />
              <Route path=":slug" element={<DanhSachAccount />} />
              <Route path=":slug/:id" element={<ChitietAccount />} />
            </Route>
            <Route path="profile" element={<ProfileLayout />}>
              <Route path="thong-tin" element={<ThongTin />} />
              <Route path="doi-mat-khau" element={<DoiMatKhau />} />
              <Route path="lich-su-giao-dich" element={<LichSuGiaoDich />} />
              <Route path="tai-khoan-da-mua" element={<TaiKhoanDaMua />} />
            </Route>
            <Route path="nap-tien" element={<NapTien />} />
            <Route path="da-xem" element={<DaXem />} />
            <Route path="404" element={<NotFound />} />
          </Route>
          {/* Admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories">
                <Route index element={<Categories />} />
                <Route path="create" element={<CategoriesCreate />} />
                <Route path="edit/:id" element={<CategoriesEdit />} />
              </Route>
              <Route path="accounts/:slugCategories">
                <Route index element={<Accounts />} />
                <Route path="create" element={<AccountsCreate />} />
                <Route path="edit/:id" element={<AccountsEdit />} />
              </Route>
              <Route path="bank-accounts">
                <Route index element={<BankAccounts />} />
                <Route path="history" element={<BankAccountsHistory />} />
              </Route>
              {/* Card Top Up */}
              <Route path="card-top-up">
                <Route index element={<CardTopUp />} />
                <Route path="history" element={<CardTopUpHistory />} />
              </Route>
              <Route path="users">
                <Route index element={<User />} />
                <Route path="edit/:userId" element={<UserEdit />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
