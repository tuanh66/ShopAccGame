import { useState } from "react";
import "../../assets/css/Client/napthe.css";
import recharge_coupon from "../../assets/img/recharge-coupon.png";
import captcha from "../../assets/img/captcha.png";
import reload from "../../assets/svg/reload.svg";
import copy from "../../assets/svg/copy.svg";

export default function NapTien() {
  const [activeTab, setActiveTab] = useState("card");
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <a href="/" className="breadcrumb-link">
            Trang chủ
          </a>
        </li>
        <li className="breadcrumb-item">
          <a href="/nap-tien" className="breadcrumb-link">
            Nạp tiền
          </a>
        </li>
      </ul>
      <h2 className="page-title">
        <i className="page-title-icon"></i>Nạp thẻ
      </h2>
      <div className="recharge">
        <div className="recharge-content">
          <div className="recharge-wrapper">
            <div className="recharge-tabs">
              <ul className="recharge-tabs-list">
                <li
                  className={`recharge-tabs-item ${
                    activeTab === "card" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("card")}
                >
                  <p class="recharge-tabs-text">Nạp thẻ cào</p>
                </li>
                <li
                  className={`recharge-tabs-item ${
                    activeTab === "atm" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("atm")}
                >
                  <p class="recharge-tabs-text">ATM tự động</p>
                </li>
              </ul>
            </div>
            <div className="recharge-panel">
              {activeTab === "card" && (
                <div className="recharge-panel-card">
                  <form className="recharge-card-form w-full">
                    <div className="form-card-wrap">
                      <div className="form-card-group">
                        <div className="form-card-field">
                          <label className="form-card-title">
                            Nhà cung cấp
                          </label>
                          <div></div>
                        </div>
                        <div className="form-card-field">
                          <label className="form-card-title">Mã số thẻ</label>
                          <div className="recharge-form-input-group">
                            <input
                              type="text"
                              placeholder="Nhập mã số thẻ của bạn"
                            />
                            <p className="form-message hidden">
                              Bạn chưa nhập mã pin
                            </p>
                          </div>
                        </div>
                        <div className="form-card-field">
                          <label className="form-card-title">Số sê-ri</label>
                          <div className="recharge-form-input-group">
                            <input
                              type="text"
                              placeholder="Nhập mã số sê-ri trên thẻ"
                            />
                            <p className="form-message hidden">
                              Bạn chưa nhập số sê-ri
                            </p>
                          </div>
                        </div>
                        <div className="form-card-field">
                          <label className="form-card-title">Mã bảo vệ</label>
                          <div className="recharge-form-input-group">
                            <div className="flex-1">
                              <input
                                type="text"
                                className=""
                                placeholder="Nhập mã bảo vệ"
                              />
                            </div>
                            <div className="mx-4 self-center">
                              <img src={captcha} alt="" />
                            </div>
                            <button className="border-none bg-transparent">
                              <img src={reload} alt="" className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="form-card-group">
                        <div className="mb-4">
                          <label className="form-card-title">
                            Chọn mệnh giá
                          </label>
                          <div>
                            <div className="amount-list">
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label active">
                                  <p className="amount-label-value active">
                                    10.000đ
                                  </p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">20.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">30.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">50.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">100.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">200.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">300.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">500.000đ</p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                              <div className="amount-item">
                                <input type="radio" hidden />
                                <label className="amount-label">
                                  <p className="amount-label-value">
                                    1.000.000đ
                                  </p>
                                  <p className="amount-label-rate">
                                    Nhận 90.0%
                                  </p>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <p className="mb-2 text-[13px] text-[var(--error-color)]">
                            *Chú ý: Nạp thẻ sai mệnh giá mất 100% giá trị thẻ.
                          </p>
                          <button className="btn w-full">Nạp ngay</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              {activeTab === "atm" && (
                <div className="recharge-panel-card">
                  <div className="p-4">
                    <div className="hidden">code sau</div>
                    <div className="">
                      <p className="text-center mb-4">&nbsp;</p>
                      <p className="font-bold mb-4">*Nạp bằng ATM:</p>
                      <table
                        className="recharge-table"
                        align="center"
                        border={1}
                        cellPadding={1}
                        cellSpacing={1}
                      >
                        <tbody>
                          <tr>
                            <td colSpan={2}>
                              Tên chủ tài khoản: Trần Quang Tuấn Anh
                            </td>
                            <td>Chi nhánh</td>
                          </tr>
                          <tr>
                            <td>TP BANK</td>
                            <td>54551159888</td>
                            <td>Đà Nẵng</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-center mb-4">&nbsp;</p>
                      <p className="mb-4">
                        <span className="text-[#e74c3c] font-bold">
                          NẠP 100K ATM NHẬN 110K TỪ SHOP
                        </span>
                        <br />
                        Nếu sau 5 phút không được cộng tiền vui lòng liên hệ
                        ZALO&nbsp;
                        <a
                          href="https://zalo.me/0702775297"
                          className="hover:text-[var(--primary-color)]"
                          target="_blank"
                        >
                          0702775297
                        </a>{" "}
                        hoặc&nbsp;
                        <a
                          href="https://zalo.me/0368102954"
                          className="hover:text-[var(--primary-color)]"
                          target="_blank"
                        >
                          0368102954
                        </a>{" "}
                        để được xử lý.
                      </p>
                      <p className="mb-4 font-bold">
                        *Chú Ý: Chuyển đúng cú pháp, sai nội dung bị chuyển qua
                        ID khác shop không chịu trách nhiệm
                      </p>
                      <p className="mb-4 font-bold">NỘI DUNG CHUYỂN KHOẢN:</p>
                      <div className="flex justify-between mb-4">
                        <p className="text-[var(--text-link)]">
                          Nội dung chuyển khoản
                        </p>
                        <div className="flex">
                          <div className="text-[13px] font-bold leading-[24px]">
                            NAP SHOPT1 2910100
                          </div>
                          <div className="copy-transfer">
                            <img src={copy} alt="" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-[30px]">
                        <img className="h-[320px] mx-auto"
                          src="https://img.vietqr.io/image/TPB-54551159888-print.jpg?addInfo=NAP%20SHOPTUANPHUONG%202910100&accountName=Tran%20Quang%20Tuan%20Anh"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="recharge-banner">
          <a href="#">
            <img src={recharge_coupon} alt="" />
          </a>
        </div>
      </div>
    </>
  );
}
