import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineRefresh } from "react-icons/hi";
import { BsCopy } from "react-icons/bs";
import { paymentService } from "@/service/paymentService";
import { useAuthStore } from "@/store/useAuthStore";
import icon_naptien from "@/assets/svg/naptien.svg";
import img_naptien from "@/assets/img/recharge-coupon.png";

const NapTien = () => {
  const [activeTab, setActiveTab] = useState("card");
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const [isSpinning, setIsSpinning] = useState(false);
  const [bankConfig, setBankConfig] = useState(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  const { user } = useAuthStore();

  const handleRefreshCaptcha = (e) => {
    e.preventDefault();
    setCaptchaKey(Date.now());
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
  };

  useEffect(() => {
    const getBankConfig = async () => {
      try {
        const res = await paymentService.readBankAccountsClient();
        if (res?.data) {
          setBankConfig(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };
    getBankConfig();
  }, []);
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/nap-tien" className="breadcrumb-link active">
            Nạp tiền
          </Link>
        </li>
      </ul>
      <section className="recharge">
        <div className="recharge-title d-none d-lg-block mt-24">
          <h2 className="d-flex align-items-center fz-24 fw-700 lh-32 ">
            <img src={icon_naptien} alt="icon_naptien" />
            Nạp tiền
          </h2>
        </div>
        <div className="recharge-content row mt-16">
          <div className="col-12 col-lg-8 recharge-left pr-8">
            <div className="recharge-money-container brs-12">
              <div className="recharge-money-tab">
                <ul className="nav justify-content-between row mx-0">
                  <li className="nav-item col-6 p-0">
                    <p
                      className={`nav-link fz-13 fw-400 text-center ${activeTab === "card" ? "active" : ""}`}
                      onClick={() => setActiveTab("card")}
                    >
                      Nạp thẻ cào
                    </p>
                  </li>
                  <li className="nav-item col-6 p-0">
                    <p
                      className={`nav-link fz-13 fw-400 text-center ${activeTab === "atm" ? "active" : ""}`}
                      onClick={() => setActiveTab("atm")}
                    >
                      ATM tự động
                    </p>
                  </li>
                </ul>
              </div>
              <div className="tab-content">
                {activeTab === "card" && (
                  <div className="tab-pane active p-16 fade show">
                    <form className="w-100">
                      <div className="row content-block">
                        <div className="col-12 col-lg-6 pr-8">
                          <div className="money-form-group mb-16">
                            <label
                              htmlFor="provider"
                              className="text-color fz-13 fw-500 mb-4"
                            >
                              Nhà cung cấp
                            </label>
                            <select
                              name="provider"
                              id="provider"
                              className="money-select"
                            >
                              <option value="0">Chọn nhà mạng</option>
                              <option value="viettel">VIETTEL</option>
                              <option value="mobifone">MOBIFONE</option>
                              <option value="vinaphone">VINAPHONE</option>
                              <option value="garena">GARENA</option>
                              <option value="zing">ZING</option>
                            </select>
                          </div>
                          <div className="money-form-group mb-16">
                            <label
                              htmlFor="card_number"
                              className="text-color fz-13 fw-500 mb-4"
                            >
                              Mã số thẻ
                            </label>
                            <input
                              id="card_number"
                              name="card_number"
                              type="text"
                              placeholder="Nhập mã số thẻ của bạn"
                              className="money-input"
                            />
                          </div>
                          <div className="money-form-group mb-16">
                            <label
                              htmlFor="serial_number"
                              className="text-color fz-13 fw-500 mb-4"
                            >
                              Số sê-ri
                            </label>
                            <input
                              id="serial_number"
                              name="serial_number"
                              type="text"
                              placeholder="Nhập số sê-ri trên thẻ"
                              className="money-input"
                            />
                          </div>
                          <div className="money-form-group mb-16">
                            <label
                              htmlFor="captcha"
                              className="text-color fz-13 fw-500 mb-4"
                            >
                              Mã bảo vệ
                            </label>
                            <div className="d-flex align-items-center">
                              <div style={{ flex: "1" }}>
                                <input
                                  id="captcha"
                                  name="captcha"
                                  type="text"
                                  className="money-input"
                                  placeholder="Nhập mã bảo vệ"
                                />
                              </div>
                              <div className="captcha px-8">
                                <img
                                  src={`${import.meta.env.VITE_API_URL}/auth/captcha?v=${captchaKey}`}
                                  alt="captcha"
                                />
                              </div>
                              <button
                                className={`brs-8 ${isSpinning ? "spin-animation" : ""}`}
                                onClick={handleRefreshCaptcha}
                              >
                                <HiOutlineRefresh />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 pl-8"></div>
                      </div>
                    </form>
                  </div>
                )}
                {activeTab === "atm" && (
                  <div className="tab-pane active p-32 fade show">
                    <form className="w-100">
                      <p className="mb-16">
                        <strong>*Nạp bằng ATM:</strong>
                      </p>
                      <table
                        style={{
                          width: "auto",
                          margin: "0 auto",
                          marginBottom: "20px",
                          borderCollapse: "collapse",
                          border: "1px solid #333",
                          color: "#3b3f5c",
                        }}
                      >
                        <tbody>
                          <tr>
                            <th
                              colSpan={2}
                              style={{
                                border: "1px solid #333",
                                padding: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                                textAlign: "left",
                              }}
                            >
                              Tên chủ tài khoản: {bankConfig.bank_account_name}
                            </th>
                            <th
                              style={{
                                border: "1px solid #333",
                                padding: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                                textAlign: "left",
                              }}
                            >
                              Chi nhánh
                            </th>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #333",
                                padding: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                              }}
                            >
                              {bankConfig.bank_name}
                            </td>
                            <td
                              style={{
                                border: "1px solid #333",
                                padding: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                              }}
                            >
                              {bankConfig.account_number}
                            </td>
                            <td
                              style={{
                                border: "1px solid #333",
                                padding: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                              }}
                            >
                              {bankConfig.bank_branch}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div 
                        className="my-16 bank-note-content" 
                        dangerouslySetInnerHTML={{ __html: bankConfig.bank_note}} 
                      />
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="fz-13 fw-400">Nội dung chuyển khoản</p>
                        <div className="d-flex">
                          <div className="text-color fz-13 fw-500">
                            {bankConfig?.bank_syntax} {user?._id || user?.id}
                          </div>
                          <div
                            className="copy-icon"
                            title="Lưu vào khay nhớ tạm"
                            onClick={() => {
                              const content = `${bankConfig.bank_syntax} ${user.id}`;
                              navigator.clipboard.writeText(content);
                            }}
                          >
                            <BsCopy />
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-center bank-qr-code"
                        style={{ marginTop: "30px" }}
                      >
                        {bankConfig && user && (
                          <img
                            src={`https://qr.sepay.vn/img?bank=${bankConfig.bank_name}&acc=${bankConfig.account_number}&template=compact&amount=&des=${encodeURIComponent(bankConfig.bank_syntax + " " + (user._id || user.id))}`}
                            alt="qr_code"
                          />
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-4 d-none d-lg-flex recharge-right pl-8">
            <img src={img_naptien} alt="recharge-coupon" />
          </div>
        </div>
      </section>
    </>
  );
};

export default NapTien;
