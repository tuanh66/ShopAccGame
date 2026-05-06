import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useAuthStore } from "../../store/useAuthStore";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import { FaLess, FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import successBuyAccount from "../../assets/img/success.png";
import { discountCodeService } from "../../service/discountCodeService";

const ChitietAccount = () => {
  // Data processing
  const { slug, id } = useParams();
  const [categories, setCategories] = useState();
  const [account, setAccount] = useState();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/accounts/${slug}/${id}`,
        );
        setCategories(res.data.category);
        setAccount(res.data.account);
        setRelated(res.data.related); // Nhận dữ liệu liên quan từ API chính
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };
    fetchAccount();
  }, [slug, id]);
  const selectAttributes = Object.entries(categories?.attributes || {}).filter(
    ([, attr]) => attr.type === "select",
  );
  // End Data processing

  // Handle image
  const images = account?.image || [];
  const slides = images.map((src) => ({ src }));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const prevAccount = useRef(null);
  const nextAccount = useRef(null);
  // End Handle image

  const hasAttributes = selectAttributes.length > 0;
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    if (!account || !categories) return;

    let viewed = JSON.parse(localStorage.getItem("viewed_accounts")) || [];

    viewed = viewed.filter((item) => item._id !== account._id);

    viewed.unshift({
      _id: account._id,
      slug: slug,
      avatar: account.avatar,
      price: account.price,
      price_sale: account.price_sale,
      attributes: account.attributes || [],
    });

    viewed = viewed.slice(0, 10);

    localStorage.setItem("viewed_accounts", JSON.stringify(viewed));
  }, [account, categories]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("viewed_accounts")) || [];
    setViewed(data);
  }, [account]);

  // Modal Detail Account
  const setShowLoginModal = useAuthStore((s) => s.setShowLoginModal);
  const user = useAuthStore((s) => s.user);
  const [showModalDetailAccount, setShowModalDetailAccount] = useState(false);
  const [showModalBuyAccount, setShowModalBuyAccount] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const close = () => {
    setShowEffect(false);
    setTimeout(() => {
      setShowModalDetailAccount(false);
      setShowModalBuyAccount(false);
    }, 300);
  };

  useEffect(() => {
    if (showModalDetailAccount) {
      setTimeout(() => {
        setShowEffect(true);
      }, 10);
    }
  }, [showModalDetailAccount]);

  useEffect(() => {
    if (showModalBuyAccount) {
      setTimeout(() => {
        setShowEffect(true);
      }, 10);
    }
  }, [showModalBuyAccount]);
  // Modal Check Buy Account

  const basePrice =
    account?.price_sale > 0 ? account.price_sale : account?.price;

  // Discount Code
  const [discountInput, setDiscountInput] = useState("");
  const [discountData, setDiscountData] = useState(null); // dữ liệu từ API
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");

  const discountAmount = discountData?.discountAmount || 0;
  const finalPrice = basePrice - discountAmount;

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    setDiscountError("");
    setDiscountSuccess("");
    setDiscountData(null);

    if (!discountInput.trim()) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const res = await discountCodeService.applyDiscountCode({
        code: discountInput.trim(),
        originalPrice: basePrice,
        applyTo: "account",
      });
      setDiscountData(res.data);
      setDiscountSuccess(
        `Áp dụng mã ${res.data.code} thành công! Giảm ${new Intl.NumberFormat("vi-VN").format(res.data.discountAmount)}đ`,
      );
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Mã không hợp lệ. Vui lòng kiểm tra lại mã";
      setDiscountError(msg);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountInput("");
    setDiscountData(null);
    setDiscountError("");
    setDiscountSuccess("");
  };

  const isEnoughMoney = user && user.balance >= finalPrice;

  // BuyAccount
  const accessToken = useAuthStore((s) => s.accessToken);
  const handleBuyAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5001/api/accounts/${id}/buy-account`,
        {
          accountId: account._id,
          discountCode: discountData?.code || "",
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setShowModalDetailAccount(false);
      setShowModalBuyAccount(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Mua thất bại, vui lòng thử lại";
      console.error("Lỗi mua account:", msg);
      toast.error(msg);
    }
  };
  // End BuyAccount
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/mua-acc" className="breadcrumb-link active">
            Mua Account
          </Link>
        </li>
        {categories && (
          <li className="breadcrumb-item">
            <Link
              to={`/mua-acc/${categories.slug}`}
              className="breadcrumb-link active"
            >
              {categories.name}
            </Link>
          </li>
        )}
        {account && (
          <li className="breadcrumb-item">
            <Link
              to={`/mua-acc/${categories.slug}/${account.accountsId}`}
              className="breadcrumb-link active"
            >
              {account.accountsId}
            </Link>
          </li>
        )}
      </ul>
      <section className="acc-detail">
        <div className="section-content row align-items-stretch">
          <div className="col-12 col-lg-7 pr-8">
            <Swiper
              className="account-swiper swiper-container-horizontal h-100"
              style={{ cursor: "grab" }}
              modules={[Navigation, Pagination, Autoplay]}
              loop={account?.image?.length > 1}
              autoplay={{
                delay: 4000, // 4 giây đổi ảnh
                disableOnInteraction: false, // bấm nút vẫn tiếp tục chạy
                pauseOnMouseEnter: true, // hover thì dừng
              }}
              pagination={{ clickable: true }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevAccount.current;
                swiper.params.navigation.nextEl = nextAccount.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {images.map((img, i) => (
                <SwiperSlide key={i} className="account-slide">
                  <img
                    src={img}
                    className="account-image"
                    onClick={() => {
                      setIndex(i);
                      setOpen(true);
                    }}
                  />
                </SwiperSlide>
              ))}
              <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={index}
                plugins={[Thumbnails, Zoom, Counter]}
              />
              <div ref={prevAccount} className="button-prev"></div>
              <div ref={nextAccount} className="button-next"></div>
            </Swiper>
          </div>
          <div className="col-12 col-lg-5 pl-8">
            <div className="card account-detail-info">
              <div className="card-body py-16 px-16">
                <div className="section-title title-color">
                  {categories?.name}
                </div>
                <div className="text-color fz-15 fw-700 lh-24 mb-6">
                  Mã số: #{account?.accountsId}
                </div>
                <hr />
                <div className="text-color fz-15 fw-700 lh-24 my-8">
                  Thông tin acc
                </div>
                <div className="row marginauto">
                  <div className="col-md-12 scroll-detail-account">
                    <table className="table-acc-info mb-24 d-none d-lg-table">
                      <tbody>
                        {account?.attributes?.map((attr, index) => (
                          <tr key={index}>
                            <td>
                              <span className="text-link fz-13">
                                {attr.label}
                              </span>
                            </td>
                            <td>
                              <span className="fz-13">
                                {attr.value || "Không có"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card disabled-color">
                  <div className="card-body text-center p-0">
                    <div className="price-acc">
                      {account?.price_sale > 0 && (
                        <div className="price-old">
                          {new Intl.NumberFormat("vi-VN").format(
                            account?.price || 0,
                          )}
                          đ
                        </div>
                      )}

                      <div className="price-current mx-8">
                        {new Intl.NumberFormat("vi-VN").format(
                          account?.price_sale > 0
                            ? account?.price_sale
                            : account?.price || 0,
                        )}
                        đ
                      </div>

                      {account?.price_sale > 0 && (
                        <div className="discount">
                          -
                          {Math.round(
                            (((account?.price || 0) - account?.price_sale) /
                              (account?.price || 1)) *
                              100,
                          )}
                          %
                        </div>
                      )}
                    </div>
                    <span>Rẻ vô đối, giá tốt nhất thị trường</span>
                  </div>
                </div>
                <hr className="my-24 d-none d-lg-block" />
                <button
                  type="submit"
                  className="btn primary w-100"
                  onClick={() => {
                    setShowModalDetailAccount(true);
                  }}
                >
                  Mua ngay
                </button>
                {showModalDetailAccount && (
                  <>
                    <div
                      className={`modal fade ${showEffect ? "show" : ""}`}
                      style={{
                        display: showModalDetailAccount ? "block" : "none",
                      }}
                      onClick={close}
                    >
                      <div
                        className="modal-dialog"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="modal-content">
                          <form className="form-check-login">
                            <div className="modal-header">
                              <p className="fz-15 fw-700 lh-24 w-100 text-center">
                                Xác nhận thanh toán
                              </p>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={close}
                              ></button>
                            </div>
                            <div className="modal-body py-24 px-0">
                              <div className="fz-13 fw-700 mb-12 text-title">
                                Thông tin mua Acc
                              </div>
                              <div className="card-gray py-8 px-12 mb-16">
                                <div className="d-flex justify-content-between align-items-center mb-16">
                                  <span className="fz-13 fw-400 text-link">
                                    Danh mục
                                  </span>
                                  <span className="fz-13 fw-500">
                                    {categories?.name}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="fz-13 fw-400 text-link">
                                    Giá tiền
                                  </span>
                                  <span className="fz-13 fw-500">
                                    {new Intl.NumberFormat("vi-VN").format(
                                      account?.price_sale > 0
                                        ? account.price_sale
                                        : account.price,
                                    )}
                                    đ
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
                                      <p
                                        className="form-message-error fz-13"
                                        style={{
                                          marginTop: "4px",
                                          textAlign: "left",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <FaRegTimesCircle className="mr-2" />
                                        {discountError}
                                      </p>
                                    )}
                                    {discountSuccess && (
                                      <p
                                        className="form-message-success fz-13"
                                        style={{
                                          marginTop: "4px",
                                          textAlign: "left",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
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
                                    {new Intl.NumberFormat("vi-VN").format(
                                      finalPrice,
                                    )}
                                    đ
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="fz-13 fw-400 text-link">
                                    Giảm giá
                                  </span>
                                  <span className={`fz-13 fw-500 ${discountAmount > 0 ? "text-primary" : ""}`}>
                                    {discountAmount > 0 ? "-" : ""}
                                    {new Intl.NumberFormat("vi-VN").format(discountAmount)}đ
                                  </span>
                                </div>
                              </div>
                              {user &&
                                user.balance < finalPrice && (
                                  <div className="not-enough-money">
                                    <div className="card-gray py-8 px-12 mt-16">
                                      <span className="fz-13 fw-400 text-red">
                                        Tài khoản của bạn không đủ để thanh
                                        toán, vui lòng nạp tiền để tiếp tục giao
                                        dịch
                                      </span>
                                    </div>
                                  </div>
                                )}
                            </div>
                            {!user ? (
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn primary w-100"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (!user) {
                                      close(); // đóng modal mua acc
                                      setShowLoginModal(true);
                                    }
                                  }}
                                >
                                  Đăng nhập
                                </button>
                              </div>
                            ) : (
                              <div className="modal-footer">
                                {isEnoughMoney ? (
                                  // ✅ ĐỦ TIỀN
                                  <button
                                    type="button"
                                    className="btn primary w-100"
                                    onClick={handleBuyAccount}
                                  >
                                    Thanh toán
                                  </button>
                                ) : (
                                  // ❌ KHÔNG ĐỦ TIỀN
                                  <>
                                    <button className="btn ghost" disabled>
                                      Thanh toán
                                    </button>
                                    <Link to="/nap-tien" className="btn primary">
                                      Nạp tiền
                                    </Link>
                                  </>
                                )}
                              </div>
                            )}
                          </form>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`modal-backdrop fade ${showEffect ? "show" : ""}`}
                    ></div>
                  </>
                )}
                {showModalBuyAccount && (
                  <>
                    <div
                      className={`modal fade modal-small ${showEffect ? "show" : ""}`}
                      id="modal-buy-account"
                      style={{
                        display: showModalBuyAccount ? "block" : "none",
                      }}
                      onClick={close}
                    >
                      <div
                        className="modal-dialog"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="modal-content p-0">
                          <div className="modal-header justify-content-center p-0">
                            <img
                              src={successBuyAccount}
                              alt="img"
                              className="py-20"
                            />
                          </div>
                          <div className="modal-body text-center px-24 py-0">
                            <p className="fz-15 fw-700 mt-12 text-title">
                              Mua Nick thành công
                            </p>
                            <div className="input-group mt-16 mb-8">
                              <label
                                htmlFor=""
                                className="mb-4 fw-500 text-title"
                              >
                                ID tài khoản
                              </label>
                              <input
                                type="text"
                                value={`#${account.accountsId}`}
                                disabled
                                readOnly
                              />
                            </div>
                            <p className="fz-13 fw-400 mt-16 text-color">
                              Nick của bạn được sẽ gửi tới trang Lịch sử mua
                              Nick, vui lòng kiểm tra và đăng nhập vào Game để
                              thay đổi mật khẩu để bảo mật cho tài khoản đã mua
                            </p>
                          </div>
                          <div className="modal-footer px-24 pb-24 pt-16">
                            <Link
                              to="/"
                              className="btn secondary"
                              style={{
                                width: "calc(40% - 6px)",
                              }}
                            >
                              Trang chủ
                            </Link>
                            <Link
                              to="/profile/tai-khoan-da-mua"
                              className="btn primary"
                              style={{
                                width: "calc(60% - 6px)",
                              }}
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
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-category mb-32">
        <div className="section-header">
          <h2 className="section-title">Tài khoản liên quan</h2>
        </div>
        <Swiper
          className="class-config-demo card-list swiper-container-horizontal"
          style={{ cursor: "grab" }}
          slidesPerView={5}
          spaceBetween={16}
        >
          {related.map((item) => (
            <SwiperSlide key={item.accountsId}>
              <div className="item-category">
                <div className="card card-hover">
                  <Link
                    to={`/mua-acc/${categories?.slug}/${item.accountsId}`}
                    className="card-body scale-thumb py-16 px-16"
                  >
                    <div className="account-thumb mb-8">
                      <img
                        src={item.avatar}
                        alt={item.accountsId}
                        className="account-thumb-image"
                      />
                    </div>
                    <div className="account-title mb-8">
                      <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                        #{item.accountsId}
                      </div>
                    </div>
                    {item.attributes?.map((attr, index) => (
                      <div className="info-attr" key={index}>
                        {attr.label}: {attr.value}
                      </div>
                    ))}
                    <div className={`price ${!hasAttributes ? "mt-40" : ""}`}>
                      <div
                        className={`price_current w-100 ${
                          !(item?.price_sale > 0) ? "mb-16" : ""
                        }`}
                      >
                        {new Intl.NumberFormat("vi-VN").format(
                          item?.price_sale > 0 ? item.price_sale : item.price,
                        )}
                        đ
                      </div>
                      {/* Chỉ hiện khi price_sale > 0 */}
                      {item?.price_sale > 0 && (
                        <div className="price_old mr-8">
                          {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                        </div>
                      )}
                      {/* Chỉ hiện khi price_sale > 0 */}
                      {item?.price_sale > 0 && (
                        <div className="discount">
                          {Math.round(
                            ((item.price - item.price_sale) / item.price) * 100,
                          )}
                          %
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {viewed.length > 1 && (
        <section className="section-category mb-32">
          <div className="section-header">
            <h2 className="section-title">Tài khoản đã xem</h2>
          </div>
          <Swiper
            className="class-config-demo card-list swiper-container-horizontal"
            style={{ cursor: "grab" }}
            slidesPerView={5}
            spaceBetween={16}
          >
            {viewed
              .filter((item) => item._id !== account?._id)
              .map((item) => {
                const hasAttr = item.attributes && item.attributes.length > 0;

                return (
                  <SwiperSlide key={item._id}>
                    <div className="item-category">
                      <div className="card card-hover">
                        <Link
                          to={`/mua-acc/${item?.slug}/${item._id}`}
                          className="card-body py-16 px-16"
                        >
                          <div className="account-thumb mb-8">
                            <img
                              src={item.avatar}
                              alt={item._id}
                              className="account-thumb-image"
                            />
                          </div>
                          <div className="account-title mb-8">
                            <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                              #{item._id}
                            </div>
                          </div>
                          {hasAttr &&
                            item.attributes.map((attr, i) => (
                              <div key={i} className="info-attr">
                                {attr.label}: {attr.value}
                              </div>
                            ))}
                          <div className={`price ${!hasAttr ? "mt-40" : ""}`}>
                            {" "}
                            <div
                              className={`price_current w-100 ${
                                !(item?.price_sale > 0) ? "mb-16" : ""
                              }`}
                            >
                              {new Intl.NumberFormat("vi-VN").format(
                                item?.price_sale > 0
                                  ? item.price_sale
                                  : item.price,
                              )}
                              đ
                            </div>
                            {/* Chỉ hiện khi price_sale > 0 */}
                            {item?.price_sale > 0 && (
                              <div className="price_old mr-8">
                                {new Intl.NumberFormat("vi-VN").format(
                                  item.price,
                                )}
                                đ
                              </div>
                            )}
                            {/* Chỉ hiện khi price_sale > 0 */}
                            {item?.price_sale > 0 && (
                              <div className="discount">
                                {Math.round(
                                  ((item.price - item.price_sale) /
                                    item.price) *
                                    100,
                                )}
                                %
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </section>
      )}
    </>
  );
};

export default ChitietAccount;
