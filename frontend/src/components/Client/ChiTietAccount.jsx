import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

const ChiTietAccount = () => {
  const API = import.meta.env.VITE_API_URL;
  const { slugCategory, slugDetail } = useParams();
  const [account, setAccount] = useState(null);
  const [category, setCategory] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API}/account/detail/${slugDetail}`);
        setAccount(res.data.data);
        setCategory(res.data.category);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [slugDetail]);

  const images = account?.image_detail || [];

  const slides = images.map((src) => ({ src }));

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/mua-acc" className="breadcrumb-link">
            Mua Account
          </Link>
        </li>
        {category && (
          <li className="breadcrumb-item">
            <Link to={`/mua-acc/${category.slug}`} className="breadcrumb-link">
              {category.name}
            </Link>
          </li>
        )}
        {account && (
          <li className="breadcrumb-item">
            <Link
              to={`/mua-acc/${category.slug}/${account.slug_detail}`}
              className="breadcrumb-link"
            >
              Chi Tiết Tài Khoản
            </Link>
          </li>
        )}
      </ul>
      <section className="mb-6 lg:mb-8">
        <div className="section-content">
          <div className="section-content-left">
            <div className="card">
              <div className="card-body p-4">
                <Swiper
                  className="rounded-[12px]"
                  modules={[Navigation, Pagination, Autoplay]}
                  loop={account?.image_detail?.length > 1}
                  autoplay={{
                    delay: 3000, // 3 giây đổi ảnh
                    disableOnInteraction: false, // bấm nút vẫn tiếp tục chạy
                    pauseOnMouseEnter: true, // hover thì dừng
                  }}
                  pagination={{ clickable: true }}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }}
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        className="cursor-pointer object-cover w-full h-full"
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
                  <div ref={prevRef} className="button-prev"></div>
                  <div ref={nextRef} className="button-next"></div>
                </Swiper>
              </div>
            </div>
          </div>
          <div className="section-content-right">
            <div className="card">
              <div className="card-body">
                <div className="section-title">{category?.name}</div>
                <div className="text-title !font-bold !mb-[6px]">
                  Mã số: #{account?.slug_detail}
                </div>
                <hr />
                <div className="text-title py-2">Thông tin acc</div>
                <div className="flex flex-wrap w-full my-0 mx-auto">
                  <div className="scroll-default">
                    <table className="table w-full mb-6 ">
                      <tbody>
                        {category?.attributes &&
                          account?.attributes_detail &&
                          Object.entries(category.attributes).map(
                            ([key, attr]) => (
                              <tr key={key}>
                                <td className="py-[6px] px-4 text-[var(--text-link)]">
                                  <span>{attr.label}</span>
                                </td>
                                <td className="py-[6px] px-4">
                                  <span>
                                    {account.attributes_detail[key] ?? "-"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card disabled_color">
                  <div className="card-body text-center !p-0">
                    <div className="flex justify-center items-center">
                      <div className="price_old">
                        {new Intl.NumberFormat("vi-VN").format(
                          account?.price_old_detail
                        )}
                        đ
                      </div>
                      <div className="price_current px-2">
                        {new Intl.NumberFormat("vi-VN").format(
                          account?.price_detail
                        )}
                        đ
                      </div>
                      <div className="discount">
                        {Math.round(
                          ((account?.price_old_detail - account?.price_detail) /
                            account?.price_old_detail) *
                            100
                        )}
                        %
                      </div>
                    </div>
                    <span className="text-[var(--text-color)] text-[13px] leading-[20px]">
                      Rẻ vô đối, giá tốt nhất thị trường
                    </span>
                  </div>
                </div>
                <div className="py-6">
                  <hr />
                </div>
                <button className="btn w-full">Mua ngay</button>
                {/* <div className="w-full mb-4">
                  <p className="text-center text-[var(--text-link)]">
                    --- hoặc ---
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChiTietAccount;
