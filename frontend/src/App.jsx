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
import ChiTietLichSuGiaoDich from "./page/profile/ChiTietLichSuGiaoDich";
import TaiKhoanDaMua from "./page/profile/TaiKhoanDaMua";
import ChiTietTaiKhoanDaMua from "./page/profile/ChiTietTaiKhoanDaMua";
// import Admin
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import Categories from "./page/admin/Categories";
import CategoriesCreate from "./page/admin/CategoriesCreate";
import CategoriesEdit from "./page/admin/CategoriesEdit";
import Accounts from "./page/admin/Accounts";
import AccountsCreate from "./page/admin/AccountsCreate";
import AccountsEdit from "./page/admin/AccountsEdit";
import AccountsHistory from "./page/admin/AccountsHistory";
import RandomCategories from "./page/admin/RandomCategories";
import RandomCategoriesCreate from "./page/admin/RandomCategoriesCreate";
import RandomCategoriesEdit from "./page/admin/RandomCategoriesEdit";
import RandomAccounts from "./page/admin/RandomAccounts";
import RandomAccountsCreate from "./page/admin/RandomAccountsCreate";
import RandomAccountsEdit from "./page/admin/RandomAccountsEdit";
import RandomAccountsHistory from "./page/admin/RandomAccountsHistory";
import BankAccounts from "./page/admin/BankAccounts";
import BankAccountsHistory from "./page/admin/BankAccountsHistory";
import CardTopUp from "./page/admin/CardTopUp";
import CardTopUpHistory from "./page/admin/CardTopUpHistory";
import User from "./page/admin/Users";
import UserEdit from "./page/admin/UsersEdit";
import UserHistory from "./page/admin/UserHistory";
import DiscountCode from "./page/admin/DiscountCode";
import DiscountCodeCreate from "./page/admin/DiscountCodeCreate";
import DiscountCodeEdit from "./page/admin/DiscountCodeEdit";
import DiscountCodeHistory from "./page/admin/DiscountCodeHistory";

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
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfileLayout />}>
                <Route path="thong-tin" element={<ThongTin />} />
                <Route path="doi-mat-khau" element={<DoiMatKhau />} />
                <Route path="lich-su-giao-dich" element={<LichSuGiaoDich />} />
                <Route
                  path="lich-su-giao-dich/:id"
                  element={<ChiTietLichSuGiaoDich />}
                />
                <Route path="tai-khoan-da-mua" element={<TaiKhoanDaMua />} />
                <Route
                  path="tai-khoan-da-mua/:id"
                  element={<ChiTietTaiKhoanDaMua />}
                />
              </Route>
            </Route>
            <Route path="nap-tien" element={<NapTien />} />
            <Route path="da-xem" element={<DaXem />} />
            <Route path="404" element={<NotFound />} />
          </Route>
          {/* Admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              {/* Categories */}
              <Route path="categories">
                <Route index element={<Categories />} />
                <Route path="create" element={<CategoriesCreate />} />
                <Route path="edit/:id" element={<CategoriesEdit />} />
              </Route>
              {/* Accounts */}
              <Route path="accounts/:slugCategories">
                <Route index element={<Accounts />} />
                <Route path="create" element={<AccountsCreate />} />
                <Route path="edit/:id" element={<AccountsEdit />} />
              </Route>
              {/* Bank Accounts */}
              <Route path="bank-accounts">
                <Route index element={<BankAccounts />} />
                <Route path="history" element={<BankAccountsHistory />} />
              </Route>
              {/* Random Categories */}
              <Route path="random-categories">
                <Route index element={<RandomCategories />} />
                <Route path="create" element={<RandomCategoriesCreate />} />
                <Route path="edit/:id" element={<RandomCategoriesEdit />} />
              </Route>
              {/* Random Accounts */}
              <Route path="random-accounts/:slugCategories">
                <Route index element={<RandomAccounts />} />
                <Route path="create" element={<RandomAccountsCreate />} />
                <Route path="edit/:id" element={<RandomAccountsEdit />} />
              </Route>
              {/* Card Top Up */}
              <Route path="card-top-up">
                <Route index element={<CardTopUp />} />
                <Route path="history" element={<CardTopUpHistory />} />
              </Route>
              {/* Discount Code */}
              <Route path="discount-code">
                <Route index element={<DiscountCode />} />
                <Route path="create" element={<DiscountCodeCreate />} />
                <Route path="edit/:id" element={<DiscountCodeEdit />} />
              </Route>
              {/* Users */}
              <Route path="users">
                <Route index element={<User />} />
                <Route path="edit/:userId" element={<UserEdit />} />
              </Route>
              <Route path="history">
                <Route path="transactions" element={<UserHistory />} />
                <Route path="accounts" element={<AccountsHistory />} />
                <Route
                  path="random-accounts"
                  element={<RandomAccountsHistory />}
                />
                <Route path="bank-accounts" element={<BankAccountsHistory />} />
                <Route path="card-top-up" element={<CardTopUpHistory />} />
                <Route path="discount-code" element={<DiscountCodeHistory />} />
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
