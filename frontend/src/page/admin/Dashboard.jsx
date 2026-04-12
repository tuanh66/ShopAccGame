import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { FaArrowDown, FaArrowUp, FaShoppingCart, FaUndo } from "react-icons/fa";

const Dashboard = () => {
  const chartOptions = {
    chart: {
      id: "sales-chart",
      toolbar: { show: false },
    },
    xaxis: {
      categories: [
        "22/02",
        "23/02",
        "24/02",
        "25/02",
        "26/02",
        "27/02",
        "28/02",
      ],
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#28a745", "#007bff"],
    legend: {
      position: "top",
    },
  };

  const chartSeries = [
    {
      name: "Nạp tiền",
      data: [0, 1, 0, 1, 3, 4, 100],
    },
    {
      name: "Mua hàng",
      data: [0, 2, 0, 0, 0, 0, 0],
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
              <h4>5</h4>
              <span className="">Tài khoản game</span>
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
              <h4>5</h4>
              <span className="">Chưa bán</span>
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
              <h4>5</h4>
              <span className="">Đã bán</span>
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
              <h4>5</h4>
              <span className="">Chưa bán</span>
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
      {/* Thống kê dịch vụ và danh mục */}
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count">
            <div className="dash-counts">
              <h4>5</h4>
              <span className="">Dịch vụ</span>
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
              <h4>5</h4>
              <span className="">Acc Random</span>
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
              <h4>5</h4>
              <span className="">Vòng Quay</span>
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
              <h4>5</h4>
              <span className="">Người dùng mới hôm nay</span>
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
      {/* Tổng hợp giao dịch */}
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-widget dash1">
            <div className="dash-widget-img">
              <FaArrowDown className="text-success" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">1,000,000</span> VNĐ
              </h5>
              <span className="dash-widget-text">Tổng nạp tiền</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-widget dash2">
            <div className="dash-widget-img">
              <FaArrowUp className="text-danger" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">0</span> VNĐ
              </h5>
              <span className="dash-widget-text">Tổng rút tiền</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-widget dash3">
            <div className="dash-widget-img">
              <FaShoppingCart className="text-info" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">0</span> VNĐ
              </h5>
              <span className="dash-widget-text">Tổng mua hàng</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-widget dash4">
            <div className="dash-widget-img">
              <FaUndo className="text-warning" />
            </div>
            <div className="dash-widget-content">
              <h5>
                <span className="counters">0</span> VNĐ
              </h5>
              <span className="dash-widget-text">Tổng hoàn tiền</span>
            </div>
          </div>
        </div>
      </div>
      {/* Phân bố loại dịch vụ và các tài khoản mua gần đây */}
      <div className="row">
        <div className="col-lg-4 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Loại dịch vụ</h5>
            </div>
            <div className="card-body pd-[20px]">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Loại</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="badge bg-success">Cày thuê</span>
                      </td>
                      <td>
                        <span className="badge bg-primary">4</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-12 col-12 d-flex">
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
                    <tr>
                      <td colSpan={3} className="text-center">
                        Không có mã giảm giá nào đang hoạt động
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Thống kê người dùng</h5>
            </div>
            <div className="card-body pd-[20px]">
              <div className="starts-list">
                <div className="starts-info mb-3">
                  <p style={{ marginBottom: "20px" }}>
                    Admin{" "}
                    <span className="badge rounded-pill bg-primary">3</span>
                  </p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: "8.33%" }}
                      role="progressbar"
                      aria-valuenow="3"
                      aria-valuemin="0"
                      aria-valuemax="36"
                    ></div>
                  </div>
                </div>
                <div className="starts-info mb-3">
                  <p style={{ marginBottom: "20px" }}>
                    Khách hàng{" "}
                    <span className="badge rounded-pill bg-success">0</span>
                  </p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: "50%" }}
                      role="progressbar"
                      aria-valuenow="3"
                      aria-valuemin="0"
                      aria-valuemax="36"
                    ></div>
                  </div>
                </div>
                <div className="starts-info mb-3">
                  <p style={{ marginBottom: "20px" }}>Thống kê người dùng</p>
                  <div className="row">
                    <div className="col-4">
                      <small>Hôm nay: </small>
                      <div className="badge bg-info">0</div>
                    </div>
                    <div className="col-4">
                      <small>Tuần này: </small>
                      <div className="badge bg-info">1</div>
                    </div>
                    <div className="col-4">
                      <small>Tháng này: </small>
                      <div className="badge bg-info">3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Giao dịch gần đây */}
      <div className="card mb-0">
        <div className="card-header">
          <h4 className="card-title">Lịch sử giao dịch gần đây</h4>
        </div>
        <div className="card-body pt-0">
          <div className="table-responsive dataview">
            <div className="dataTables_wrapper">
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
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
                      <tr>
                        <td>1</td>
                        <td>
                          <Link to="#">moderator</Link>
                        </td>
                        <td>
                          <span className="badge bg-warning">Hoàn tiền</span>
                        </td>
                        <td>1,000,000 VNĐ</td>
                        <td>2,000,000 VNĐ</td>
                        <td>3,000,000 VNĐ</td>
                        <td>Hoàn tiền cho yêu cầu rút tiền bị từ chối ID: 2</td>
                        <td>26/05/2025 09:08</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>
                          <Link to="#">moderator</Link>
                        </td>
                        <td>
                          <span className="badge bg-warning">Hoàn tiền</span>
                        </td>
                        <td>1,000,000 VNĐ</td>
                        <td>2,000,000 VNĐ</td>
                        <td>3,000,000 VNĐ</td>
                        <td>Hoàn tiền cho yêu cầu rút tiền bị từ chối ID: 2</td>
                        <td>26/05/2025 09:08</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>
                          <Link to="#">moderator</Link>
                        </td>
                        <td>
                          <span className="badge bg-warning">Hoàn tiền</span>
                        </td>
                        <td>1,000,000 VNĐ</td>
                        <td>2,000,000 VNĐ</td>
                        <td>3,000,000 VNĐ</td>
                        <td>Hoàn tiền cho yêu cầu rút tiền bị từ chối ID: 2</td>
                        <td>26/05/2025 09:08</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Biểu đồ tổng quan và Dịch vụ cần xử lý */}
      <div className="row mt-4">
        <div className="col-lg-7 col-sm-12 col-12 d-flex">
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
                      <th>20/02</th>
                      <th>21/02</th>
                      <th>22/02</th>
                      <th>23/02</th>
                      <th>24/02</th>
                      <th>25/02</th>
                      <th>26/02</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Nạp tiền</strong>
                      </td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Mua hàng</strong>
                      </td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Dịch vụ đang chờ xử lý</h4>
              <Link to="#" className="btn primary btn-sm">
                Xem tất cả
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Dịch vụ</th>
                      <th>Người dùng</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center">
                        Không có dịch vụ nào đang chờ xử lý
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Rút tiền đang chờ và Rút tài nguyên đang chờ */}
      <div className="row">
        <div className="col-lg-6 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Yêu cầu rút tiền đang chờ</h4>
              <Link to="#" className="btn primary btn-sm">
                Xem tất cả
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive dataview">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người dùng</th>
                      <th>Số tiền</th>
                      <th>Ngân hàng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="text-center">
                        Không có yêu cầu rút nào
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">
                Yêu cầu rút tài nguyên đang chờ
              </h4>
              <Link to="#" className="btn primary btn-sm">
                Xem tất cả
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive dataview">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người dùng</th>
                      <th>Loại</th>
                      <th>Số lượng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="text-center">
                        Không có yêu cầu rút tài nguyên nào
                      </td>
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
