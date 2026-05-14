import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { FaArrowDown, FaShoppingCart, FaUndo } from "react-icons/fa";
import { useState, useEffect } from "react";
import { dashboardService } from "../../service/dashboardService";
import { formatCurrency, formatDate } from "../../utils/format";
import Loading from "../../components/common/Loading";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const transactionType = {
    bankAccount: {
      label: "Chuyển khoản",
      className: "status-success",
    },
    topUp: {
      label: "Nạp thẻ",
      className: "status-success",
    },
    buyAccount: {
      label: "Mua acc",
      className: "bg-info",
    },
    adminTopUp: {
      label: "Admin sửa",
      className: "bg-danger",
    },
    discountCode: {
      label: "Mã giảm giá",
      className: "bg-secondary",
    },
  };
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi lấy thống kê dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  const {
    counts,
    finance,
    recentTransactions,
    userStatistics,
    registrationStatistics,
    topupAndPurchaseStatistics,
    activeDiscountCodes,
  } = stats || {};

  const chartOptions = {
    chart: {
      id: "sales-chart",
      toolbar: { show: false },
    },
    xaxis: {
      categories: topupAndPurchaseStatistics?.map((d) => d.date) || [],
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#28C76F", "#008FFB"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
  };

  const chartSeries = [
    {
      name: "Nạp tiền",
      data: topupAndPurchaseStatistics?.map((d) => d.topup) || [],
    },
    {
      name: "Mua hàng",
      data: topupAndPurchaseStatistics?.map((d) => d.purchase) || [],
    },
  ];

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Admin Dashboard</h4>
          <span>Thống kê tổng quan hệ thống</span>
        </div>
      </div>

      {/* Thống kê tài khoản */}
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count">
            <div className="dash-counts">
              <h4>{counts.totalAccounts}</h4>
              <span>Tài khoản game</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das1">
            <div className="dash-counts">
              <h4>{counts.unsoldAccounts}</h4>
              <span>Chưa bán</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-shopping-cart"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das2">
            <div className="dash-counts">
              <h4>{counts.soldAccounts}</h4>
              <span>Đã bán</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check-circle"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das3">
            <div className="dash-counts">
              <h4>{counts.totalUsers}</h4>
              <span>Người dùng</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-users"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê dịch vụ */}
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count">
            <div className="dash-counts">
              <h4>0</h4>
              <span>Dịch vụ</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-briefcase"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das1">
            <div className="dash-counts">
              <h4>{counts.totalRandomAccounts}</h4>
              <span>Acc Random</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-package"
              >
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das2">
            <div className="dash-counts">
              <h4>0</h4>
              <span>Vòng Quay</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-refresh-cw"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das3">
            <div className="dash-counts">
              <h4>{counts.newUsersToday}</h4>
              <span>Người dùng mới hôm nay</span>
            </div>
            <div className="dash-imgs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user-plus"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tổng hợp giao dịch tài chính */}
      <div className="row">
        <div className="col-lg-4 col-sm-12 col-12 d-flex">
          <div className="dash-widget dash1">
            <div className="dash-widget-img">
              <FaArrowDown className="text-success" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">
                  {formatCurrency(finance?.totalDeposit)}
                </span>
              </h5>
              <span className="dash-widget-text">Tổng nạp tiền</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-12 col-12 d-flex">
          <div className="dash-widget dash3">
            <div className="dash-widget-img">
              <FaShoppingCart className="text-info" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">
                  {formatCurrency(finance?.totalPurchase)}
                </span>
              </h5>
              <span className="dash-widget-text">Tổng mua hàng</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-12 col-12 d-flex">
          <div className="dash-widget dash4">
            <div className="dash-widget-img">
              <FaUndo className="text-warning" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">
                  {formatCurrency(finance?.totalRefund)}
                </span>
              </h5>
              <span className="dash-widget-text">Tổng hoàn tiền</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mã giảm giá và Thống kê người dùng */}
      <div className="row">
        <div className="col-lg-6 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Mã giảm giá đang hoạt động</h5>
            </div>
            <div className="card-body pd-[20px]">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Giá trị</th>
                      <th>Hạn dùng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDiscountCodes?.length > 0 ? (
                      activeDiscountCodes.map((item) => (
                        <tr key={item.discountCodeId}>
                          <td>{item.code}</td>
                          <td>
                            {item.type === "percent"
                              ? `${item.value}%`
                              : formatCurrency(item.value)}
                          </td>
                          <td>
                            {item.expirationDate
                              ? formatDate(item.expirationDate)
                              : "Không giới hạn"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">
                          Không có mã giảm giá nào đang hoạt động
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Thống kê người dùng</h5>
            </div>
            <div className="card-body pd-[20px]">
              <div className="starts-list">
                <div className="starts-info mb-3">
                  <p style={{ marginBottom: "20px" }}>
                    Admin{" "}
                    <span className="badge rounded-pill bg-primary">
                      {userStatistics?.admin || 0}
                    </span>
                  </p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      style={{
                        width: `${((userStatistics?.admin || 0) / (counts?.totalUsers || 1)) * 100}%`,
                      }}
                      role="progressbar"
                    ></div>
                  </div>
                </div>
                <div className="starts-info mb-3">
                  <p style={{ marginBottom: "20px" }}>
                    Khách hàng{" "}
                    <span className="badge rounded-pill bg-success">
                      {userStatistics?.customer || 0}
                    </span>
                  </p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${((userStatistics?.customer || 0) / (counts?.totalUsers || 1)) * 100}%`,
                      }}
                      role="progressbar"
                    ></div>
                  </div>
                </div>
                <div className="starts-info mb-3">
                  <p style={{ marginBottom: "20px" }}>Thống kê đăng ký</p>
                  <div className="row">
                    <div className="col-4">
                      <small>Hôm nay: </small>
                      <div className="badge bg-info">
                        {registrationStatistics?.today || 0}
                      </div>
                    </div>
                    <div className="col-4">
                      <small>Tuần này: </small>
                      <div className="badge bg-info">
                        {registrationStatistics?.thisWeek || 0}
                      </div>
                    </div>
                    <div className="col-4">
                      <small>Tháng này: </small>
                      <div className="badge bg-info">
                        {registrationStatistics?.thisMonth || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử giao dịch gần đây */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Lịch sử giao dịch gần đây</h4>
        </div>
        <div className="card-body pt-0">
          <div className="table-responsive" style={{ maxHeight: "300px" }}>
            <table className="table">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#fff",
                }}
              >
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Loại giao dịch</th>
                  <th>Số tiền</th>
                  <th>Số dư trước</th>
                  <th>Số dư sau</th>
                  <th>Mô tả</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions?.length > 0 ? (
                  recentTransactions.map((item) => (
                    <tr key={item.userHistoryId}>
                      <td>#{item.userHistoryId}</td>
                      <td>{item.userName}</td>
                      <td>
                        <span
                          className={`badges ${transactionType[item.transaction]?.className || "bg-secondary"}`}
                          style={{ width: "100px" }}
                        >
                          {transactionType[item.transaction]?.label ||
                            item.transaction}
                        </span>
                      </td>
                      <td
                        className={
                          item.balance_after > item.balance_before
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {item.balance_after > item.balance_before ? "+" : "-"}
                        {formatCurrency(item.amount)}
                      </td>
                      <td>{formatCurrency(item.balance_before)}</td>
                      <td>{formatCurrency(item.balance_after)}</td>
                      <td>{item.description}</td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      Không có giao dịch nào gần đây
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Biểu đồ và Bảng thống kê 7 ngày */}
      <div className="row mt-4">
        <div className="col-lg-12 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Thống kê nạp tiền & mua hàng (7 ngày gần đây)
              </h5>
            </div>
            <div className="card-body">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={315}
              />
              <div className="table-responsive mt-3">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      {topupAndPurchaseStatistics?.map((d, index) => (
                        <th key={index}>{d.date}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Nạp tiền</strong>
                      </td>
                      {topupAndPurchaseStatistics?.map((d, index) => (
                        <td key={index}>{formatCurrency(d.topup)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>
                        <strong>Mua hàng</strong>
                      </td>
                      {topupAndPurchaseStatistics?.map((d, index) => (
                        <td key={index}>{formatCurrency(d.purchase)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
