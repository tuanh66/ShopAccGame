import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import logo from "../assets/img/logo.png";
import dashboard from "../assets/svg/dashboard.svg";
import product from "../assets/svg/product.svg";
import users from "../assets/svg/users1.svg";
import dollarSquare from "../assets/svg/dollar-square.svg";
import sales from "../assets/svg/sales1.svg";
import settings from "../assets/svg/setting1.svg";

const AdminLayout = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(() => {
    if (location.pathname.includes("/admin/accounts")) return "Tài khoản";
    if (location.pathname.includes("/admin/categories")) return "Danh mục";
    if (location.pathname.includes("/admin/users")) return "Người dùng";
    if (location.pathname.includes("/admin/payment") || location.pathname.includes("/admin/bank-accounts")) return "Nạp tiền";
    return "Danh mục";
  });
  const [categories, setCategories] = useState([]);
  
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/accounts")) setOpenMenu("Tài khoản");
    else if (path.includes("/admin/categories")) setOpenMenu("Danh mục");
    else if (path.includes("/admin/users")) setOpenMenu("Người dùng");
    else if (path.includes("/admin/payment") || path.includes("/admin/bank-accounts")) setOpenMenu("Nạp tiền");
  }, [location.pathname]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/categories/admin",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setCategories(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };
    fetchCategories();
  }, [accessToken]);

  const toggleMenu = (e, menuName) => {
    e.preventDefault();
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  return (
    <>
      <div className="header-admin">
        <div
          className="header-admin-left active"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Link to="/admin" className="logo">
            <img src={logo} alt="logo" />
          </Link>
          {/* <Link to="/admin" className="logo-small">
            <img src={logo} alt="logo" />
          </Link> */}
          <button type="button" className="toggole_btn active"></button>
        </div>
      </div>
      <div className="sidebar-admin">
        <div className="slimScrollDiv">
          <div
            className="sidebar-inner slimscroll"
            style={{ overflow: "hidden", width: "100%" }}
          >
            <div className="sidebar-menu">
              <ul>
                {/* Dashboard */}
                <li>
                  <Link
                    to="/admin"
                    className={location.pathname === "/admin" ? "active" : ""}
                  >
                    <img src={dashboard} alt="dashboard" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                {/* Danh mục */}
                <li
                  className={`submenu ${openMenu === "Danh mục" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Danh mục")}
                    className={openMenu === "Danh mục" ? "subdrop active" : ""}
                  >
                    <img src={product} alt="product" />
                    <span>Danh mục</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display: openMenu === "Danh mục" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/categories"
                        className={
                          location.pathname === "/admin/categories"
                            ? "active"
                            : ""
                        }
                      >
                        Danh sách danh mục
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categories/create"
                        className={
                          location.pathname === "/admin/categories/create"
                            ? "active"
                            : ""
                        }
                      >
                        Thêm danh mục mới
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Tài khoản */}
                <li
                  className={`submenu ${openMenu === "Tài khoản" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Tài khoản")}
                    className={openMenu === "Tài khoản" ? "subdrop active" : ""}
                  >
                    <img src={product} alt="product" />
                    <span>Tài khoản</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display: openMenu === "Tài khoản" ? "block" : "none",
                    }}
                  >
                    {categories.map((item) => (
                      <li key={item._id}>
                        <Link
                          to={`/admin/accounts/${item.slug}`}
                          className={
                            location.pathname === `/admin/accounts/${item.slug}`
                              ? "active"
                              : ""
                          }
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {/* Danh mục Random */}
                <li
                  className={`submenu ${openMenu === "Danh mục Random" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Danh mục Random")}
                    className={
                      openMenu === "Danh mục Random" ? "subdrop active" : ""
                    }
                  >
                    <img src={product} alt="product" />
                    <span>Danh mục Random</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display:
                        openMenu === "Danh mục Random" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/random-categories"
                        className={
                          location.pathname === "/admin/random-categories"
                            ? "active"
                            : ""
                        }
                      >
                        Danh sách danh mục random
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categories/create"
                        className={
                          location.pathname ===
                          "/admin/random-categories/create"
                            ? "active"
                            : ""
                        }
                      >
                        Thêm danh mục random
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Tài khoản Random */}
                <li
                  className={`submenu ${openMenu === "Tài khoản Random" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Tài khoản Random")}
                    className={
                      openMenu === "Tài khoản Random" ? "subdrop active" : ""
                    }
                  >
                    <img src={product} alt="product" />
                    <span>Tài khoản Random</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display:
                        openMenu === "Tài khoản Random" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/random-accounts"
                        className={
                          location.pathname === "/admin/random-accounts"
                            ? "active"
                            : ""
                        }
                      >
                        Danh sách tài khoản random
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/random-accounts/create"
                        className={
                          location.pathname === "/admin/random-accounts/create"
                            ? "active"
                            : ""
                        }
                      >
                        Thêm tài khoản random
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Vòng quay may mắn */}
                <li
                  className={`submenu ${openMenu === "Vòng quay may mắn" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Vòng quay may mắn")}
                    className={
                      openMenu === "Vòng quay may mắn" ? "subdrop active" : ""
                    }
                  >
                    <img src={product} alt="product" />
                    <span>Vòng quay may mắn</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display:
                        openMenu === "Vòng quay may mắn" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/lucky-wheels"
                        className={
                          location.pathname === "/admin/lucky-wheels"
                            ? "active"
                            : ""
                        }
                      >
                        Danh sách VQMM
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/lucky-wheels/create"
                        className={
                          location.pathname === "/admin/lucky-wheels/create"
                            ? "active"
                            : ""
                        }
                      >
                        Thêm VQMM
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/lucky-wheels/history"
                        className={
                          location.pathname === "/admin/lucky-wheels/history"
                            ? "active"
                            : ""
                        }
                      >
                        Lịch sử quay
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Người dùng */}
                <li
                  className={`submenu ${openMenu === "Người dùng" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Người dùng")}
                    className={
                      openMenu === "Người dùng" ? "subdrop active" : ""
                    }
                  >
                    <img src={users} alt="users" />
                    <span>Người dùng</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display: openMenu === "Người dùng" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/users"
                        className={
                          location.pathname === "/admin/users" ? "active" : ""
                        }
                      >
                        Danh sách người dùng
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Nạp tiền */}
                <li
                  className={`submenu ${openMenu === "Nạp tiền" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Nạp tiền")}
                    className={openMenu === "Nạp tiền" ? "subdrop active" : ""}
                  >
                    <img src={dollarSquare} alt="dollarSquare" />
                    <span>Nạp tiền</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display: openMenu === "Nạp tiền" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/card-top-up"
                        className={
                          location.pathname === "/admin/card-top-up" ? "active" : ""
                        }
                      >
                        Nạp thẻ
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/card-top-up/history"
                        className={
                          location.pathname === "/admin/card-top-up/history"
                            ? "active"
                            : ""
                        }
                      >
                        Lịch sử nạp thẻ
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/bank-accounts"
                        className={
                          location.pathname === "/admin/bank-accounts"
                            ? "active"
                            : ""
                        }
                      >
                        Chuyển khoản
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/bank-accounts/history"
                        className={
                          location.pathname === "/admin/bank-accounts/history"
                            ? "active"
                            : ""
                        }
                      >
                        Lịch sử chuyển khoản
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Mã giảm giá */}
                <li
                  className={`submenu ${openMenu === "Mã giảm giá" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Mã giảm giá")}
                    className={
                      openMenu === "Mã giảm giá" ? "subdrop active" : ""
                    }
                  >
                    <img src={sales} alt="sales" />
                    <span>Mã giảm giá</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display: openMenu === "Mã giảm giá" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/discount-codes"
                        className={
                          location.pathname === "/admin/discount-codes"
                            ? "active"
                            : ""
                        }
                      >
                        Danh sách mã giảm giá
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/discount-codes/create"
                        className={
                          location.pathname === "/admin/discount-codes/create"
                            ? "active"
                            : ""
                        }
                      >
                        Thêm mã giảm giá
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Cài đặt hệ thống */}
                <li
                  className={`submenu ${openMenu === "Cài đặt hệ thống" ? "submenu-open" : ""}`}
                >
                  <Link
                    to="#"
                    onClick={(e) => toggleMenu(e, "Cài đặt hệ thống")}
                    className={
                      openMenu === "Cài đặt hệ thống" ? "subdrop active" : ""
                    }
                  >
                    <img src={settings} alt="settings" />
                    <span>Cài đặt hệ thống</span>
                    <span className="menu-arrow">
                      <HiOutlineChevronRight />
                    </span>
                  </Link>
                  <ul
                    style={{
                      display:
                        openMenu === "Cài đặt hệ thống" ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link
                        to="/admin/settings/general"
                        className={
                          location.pathname === "/admin/settings/general"
                            ? "active"
                            : ""
                        }
                      >
                        Cài đặt chung
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/settings/social"
                        className={
                          location.pathname === "/admin/settings/social"
                            ? "active"
                            : ""
                        }
                      >
                        Mạng xã hội & Thông báo
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/settings/login"
                        className={
                          location.pathname === "/admin/settings/login"
                            ? "active"
                            : ""
                        }
                      >
                        Cài đặt đăng nhập
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="page-wrapper-admin">
        <div className="content-admin">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
