import { Link } from "react-router-dom";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { formatCurrency } from "@/utils/format";
import successBuyAccount from "../../assets/img/success.png";

const PurchaseModal = ({
  show,
  showEffect,
  close,
  account,
  categories,
  user,
  discountInput,
  setDiscountInput,
  discountData,
  discountError,
  setDiscountError,
  discountSuccess,
  handleApplyDiscount,
  handleRemoveDiscount,
  finalPrice,
  discountAmount,
  handleBuyAccount,
  showModalBuyAccount,
  setShowLoginModal,
}) => {
  const isEnoughMoney = user && user.balance >= finalPrice;

  return (
    <>
      {/* Modal Xác nhận thanh toán */}
      {show && (
        <>
          <div
            className={`modal fade ${showEffect ? "show" : ""}`}
            style={{
              display: show ? "block" : "none",
            }}
            onClick={close}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <form className="form-check-login">
                  <div className="modal-header">
                    <p className="fz-15 fw-700 lh-24 w-100 text-center">
                      Xác nhận thanh toán
                    </p>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={close}
                    ></button>
                  </div>
                  <div className="modal-body py-24 px-0">
                    <div className="fz-13 fw-700 mb-12 text-title">
                      Thông tin mua Acc
                    </div>
                    <div className="card-gray py-8 px-12 mb-16">
                      <div className="d-flex justify-content-between align-items-center mb-16">
                        <span className="fz-13 fw-400 text-link">Danh mục</span>
                        <span className="fz-13 fw-500">{categories?.name}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fz-13 fw-400 text-link">Giá tiền</span>
                        <span className="fz-13 fw-500">
                          {formatCurrency(
                            account?.price_sale > 0
                              ? account.price_sale
                              : account.price,
                          )}
                        </span>
                      </div>
                    </div>

                    {account?.attributes?.length > 0 && (
                      <div className="card-gray py-8 px-12 mb-16">
                        {account.attributes.map((attr, index, arr) => (
                          <div
                            key={index}
                            className={`d-flex justify-content-between align-items-center ${
                              index !== arr.length - 1 ? "mb-16" : ""
                            }`}
                          >
                            <span className="fz-13 fw-400 text-link">
                              {attr.label}
                            </span>
                            <span className="fz-13 fw-500">
                              {attr.value || "Không có"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="card-gray py-8 px-12 mb-16">
                      <div className="d-flex justify-content-between align-items-center mb-16">
                        <span className="fz-13 fw-400 text-link">
                          Phương thức thanh toán
                        </span>
                        <span className="fz-13 fw-500">
                          Tài khoản Shopbrand
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fz-13 fw-400 text-link">
                          Phí thanh toán
                        </span>
                        <span className="fz-13 fw-500">Miễn phí</span>
                      </div>
                    </div>

                    {user && (
                      <div className="card-gray py-8 px-12 mb-16">
                        <div className="d-flex justify-content-between align-items-center mb-16">
                          <span className="fz-13 fw-400 text-link">
                            Nhập mã giảm giá
                          </span>
                        </div>
                        <div>
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <input
                              type="text"
                              value={discountInput}
                              onChange={(e) => {
                                setDiscountInput(e.target.value);
                                if (discountError) setDiscountError("");
                              }}
                              disabled={!!discountData}
                              placeholder="Nhập mã giảm giá"
                            />
                            {!discountData ? (
                              <button
                                className="btn primary fz-13 fw-400"
                                type="button"
                                style={{
                                  display: "inline-block",
                                  padding: "0 12px",
                                  marginLeft: "8px",
                                  width: "90px",
                                }}
                                onClick={handleApplyDiscount}
                              >
                                Áp dụng
                              </button>
                            ) : (
                              <button
                                className="btn red fz-13 fw-400"
                                type="button"
                                style={{
                                  display: "inline-block",
                                  padding: "0 12px",
                                  marginLeft: "8px",
                                  width: "90px",
                                  color: "white",
                                }}
                                onClick={handleRemoveDiscount}
                              >
                                Huỷ
                              </button>
                            )}
                          </div>
                          {discountError && (
                            <p className="form-message-error fz-13 mt-4 text-left d-flex align-items-center">
                              <FaRegTimesCircle className="mr-2" />
                              {discountError}
                            </p>
                          )}
                          {discountSuccess && (
                            <p className="form-message-success fz-13 mt-4 text-left d-flex align-items-center">
                              <FaRegCheckCircle className="mr-2" />
                              {discountSuccess}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="card-gray py-8 px-12 mb-16">
                      <div className="d-flex justify-content-between align-items-center mb-16">
                        <span className="fz-13 fw-400 text-link">
                          Tổng thanh toán
                        </span>
                        <span className="fz-13 fw-500 text-primary">
                          {formatCurrency(finalPrice)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fz-13 fw-400 text-link">Giảm giá</span>
                        <span
                          className={`fz-13 fw-500 ${discountAmount > 0 ? "text-primary" : ""}`}
                        >
                          {discountAmount > 0 ? "-" : ""}
                          {formatCurrency(discountAmount)}
                        </span>
                      </div>
                    </div>

                    {user && user.balance < finalPrice && (
                      <div className="not-enough-money mt-16">
                        <div className="card-gray py-8 px-12">
                          <span className="fz-13 fw-400 text-red">
                            Tài khoản của bạn không đủ để thanh toán, vui lòng
                            nạp tiền để tiếp tục giao dịch
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    {!user ? (
                      <button
                        type="button"
                        className="btn primary w-100"
                        onClick={(e) => {
                          e.preventDefault();
                          close();
                          setShowLoginModal(true);
                        }}
                      >
                        Đăng nhập
                      </button>
                    ) : isEnoughMoney ? (
                      <button
                        type="button"
                        className="btn primary w-100"
                        onClick={handleBuyAccount}
                      >
                        Thanh toán
                      </button>
                    ) : (
                      <div className="d-flex w-100 gap-2">
                        <button className="btn ghost flex-grow-1" disabled>
                          Thanh toán
                        </button>
                        <Link
                          to="/nap-tien"
                          className="btn primary flex-grow-1 text-center"
                        >
                          Nạp tiền
                        </Link>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            className={`modal-backdrop fade ${showEffect ? "show" : ""}`}
          ></div>
        </>
      )}

      {/* Modal Mua thành công */}
      {showModalBuyAccount && (
        <>
          <div
            className={`modal fade modal-small ${showEffect ? "show" : ""}`}
            style={{
              display: showModalBuyAccount ? "block" : "none",
            }}
            onClick={close}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content p-0">
                <div className="modal-header justify-content-center p-0">
                  <img src={successBuyAccount} alt="img" className="py-20" />
                </div>
                <div className="modal-body text-center px-24 py-0">
                  <p className="fz-15 fw-700 mt-12 text-title">
                    Mua Nick thành công
                  </p>
                  <div className="input-group mt-16 mb-8">
                    <label className="mb-4 fw-500 text-title">
                      ID tài khoản
                    </label>
                    <input
                      type="text"
                      value={`#${account?.accountsId || ""}`}
                      disabled
                      readOnly
                    />
                  </div>
                  <p className="fz-13 fw-400 mt-16 text-color">
                    Nick của bạn được sẽ gửi tới trang Lịch sử mua Nick, vui
                    lòng kiểm tra và đăng nhập vào Game để thay đổi mật khẩu để
                    bảo mật cho tài khoản đã mua
                  </p>
                </div>
                <div className="modal-footer px-24 pb-24 pt-16">
                  <Link
                    to="/"
                    className="btn secondary"
                    style={{ width: "calc(40% - 6px)" }}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/profile/tai-khoan-da-mua"
                    className="btn primary"
                    style={{ width: "calc(60% - 6px)" }}
                  >
                    Tài khoản đã mua
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`modal-backdrop fade ${showEffect ? "show" : ""}`}
          ></div>
        </>
      )}
    </>
  );
};

export default PurchaseModal;
