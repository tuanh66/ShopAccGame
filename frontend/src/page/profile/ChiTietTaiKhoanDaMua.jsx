import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { historyService } from "../../service/historyService";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import { formatDate, formatCurrency } from "../../utils/format";

const ChiTietTaiKhoanDaMua = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const fetchDetail = async () => {
    try {
      const res = await historyService.readAccountsBoughtHistoryById(id);
      setAccount(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết:", error);
      toast.error("Không thể lấy thông tin tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleCopy = (text) => {
    if (!text || text === "********") {
      toast.error("Vui lòng nhấn 'Lấy mật khẩu' trước!");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép");
  };

  const handleGetPassword = async () => {
    if (unlocking) return;
    setUnlocking(true);
    try {
      const res = await historyService.updatePasswordStatus(id);
      setAccount(res.data);
      toast.success("Đã lấy thông tin tài khoản!");
    } catch (error) {
      console.error("Lỗi khi lấy mật khẩu:", error);
      toast.error(error.response?.data?.message || "Lấy mật khẩu thất bại");
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) return <div className="text-center py-40">Đang tải...</div>;
  if (!account)
    return <div className="text-center py-40">Không tìm thấy dữ liệu</div>;

  const slides = account.image?.map((src) => ({ src })) || [];

  return (
    <div>
      <div className="history-detail-title brs-12 p-16 mb-16">
        <h1 className="fz-20 fw-700 lh-28 title-color">
          Chi tiết tài khoản đã mua
        </h1>
      </div>
      <div className="history-detail-content brs-12">
        <div className="history-detail-subtitle py-12 px-16 fz-15 fw-500 lh-24">
          {account.categoryName}
        </div>
        <div className="px-16 pb-24">
          <div className="history-detail-label fz-13 fw-500 py-12">
            Thông tin giao dịch
          </div>
          <div className="history-detail-info-block brs-12 p-16 mb-16">
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">ID</p>
              <div className="fz-13 fw-500">{account.accountsId}</div>
            </div>
            <div className="history-detail-attr d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Game</p>
              <div className="fz-13 fw-500">{account.categoryName}</div>
            </div>
          </div>
          <div className="history-detail-info-block brs-12 p-16 mb-16">
            <div className="mb-12">
              <label
                className="text-border fz-13 fw-500 lh-20 mb-4 "
                htmlFor=""
              >
                Tài khoản
              </label>
              <div className="copy-input">
                <input
                  type="text"
                  value={account.username}
                  readOnly
                />
                <div 
                  className="icon-copy" 
                  onClick={() => handleCopy(account.username)}
                  title="Sao chép"
                ></div>
              </div>
            </div>
            <div className="">
              <label
                className="text-border fz-13 fw-500 lh-20 mb-4 "
                htmlFor=""
              >
                Mật khẩu
              </label>
              <div className="copy-input position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={account.password}
                  readOnly
                />
                <div className="action-icons d-flex align-items-center">
                  <div
                    className="eye-icon mr-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEye className="fz-20" />
                    ) : (
                      <FaRegEyeSlash className="fz-20" />
                    )}
                  </div>
                  <div 
                    className="icon-copy" 
                    onClick={() => handleCopy(account.password)}
                    title="Sao chép"
                  ></div>
                </div>
              </div>
            </div>
            {account.passwordStatus && (
              <>
                <div className="w-100 text-left text-focus fz-13 fw-400 lh-20 mt-12">
                  Đã lấy mật khẩu lúc: {formatDate(account.updatedAt)}
                </div>
                <div className="mt-12">
                  <div
                    className="brs-8 px-12 py-16"
                    style={{ background: "#F3F3F7" }}
                  >
                    <span className="text-color fz-13 fw-400 lh-20 text-center">
                      Để bảo mật bạn vui lòng thay đổi mật khẩu và tên đăng nhập
                      của tải khoản đã mua!
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="history-detail-info-block brs-12 p-16">
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Trị giá</p>
              <div className="fz-13 fw-500">
                {formatCurrency(
                  account.price_sale > 0 ? account.price_sale : account.price,
                )}
              </div>
            </div>
            <div className="history-detail-attr mb-8 d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Ngày giao dịch</p>
              <div className="fz-13 fw-500">
                {formatDate(account.createdAt)}
              </div>
            </div>
            <div className="history-detail-attr d-flex justify-content-between align-items-center">
              <p className="fz-13 fw-400">Trạng thái</p>
              <div
                className={`fz-13 fw-500 ${account.status ? "text-green" : "text-red"}`}
              >
                {account.status ? "Thành công" : "Thất bại"}
              </div>
            </div>
          </div>
          {!account.passwordStatus && (
            <div className="mt-16 d-flex align-items-center justify-content-end">
              <button
                className="btn primary"
                onClick={handleGetPassword}
                disabled={unlocking}
              >
                {unlocking ? "Đang xử lý..." : "Lấy mật khẩu"}
              </button>
            </div>
          )}
          {account.passwordStatus && (
            <>
              <div className="my-16">
                <Swiper
                  modules={[Navigation, Pagination]}
                  pagination={{ clickable: true }}
                  spaceBetween={16}
                  slidesPerView={1.2}
                  breakpoints={{
                    768: {
                      slidesPerView: 3,
                    },
                  }}
                  grabCursor={true}
                  className="bought-account-swiper"
                >
                  {account.image?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="gallery-photo"
                        onClick={() => {
                          setPhotoIndex(index);
                          setOpenLightbox(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img src={img} alt={`nick-img-${index}`} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Lightbox
                  open={openLightbox}
                  close={() => setOpenLightbox(false)}
                  slides={slides}
                  index={photoIndex}
                  plugins={[Thumbnails, Zoom, Counter]}
                />
              </div>
              <div className="history-detail-info-block brs-12 p-16">
                {account.attributes?.map((attr, index) => (
                  <div
                    key={index}
                    className="history-detail-attr mb-8 d-flex justify-content-between align-items-center"
                  >
                    <p className="fz-13 fw-400">{attr.label}</p>
                    <div className="fz-13 fw-500">{attr.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChiTietTaiKhoanDaMua;
