import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
  const [category, setCategory] = useState(null);
  const [account, setAccount] = useState(null);
  const [relatedAccount, setRelatedAccount] = useState([]);
  const prevAccount = useRef(null);
  const nextAccount = useRef(null);
  const prevRelate = useRef(null);
  const nextRelate = useRef(null);

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

  useEffect(() => {
    if (!account?.slug_detail) return;

    const fetchRelated = async () => {
      try {
        const res = await axios.get(
          `${API}/account/related/${account.slug_detail}?limit=10`
        );
        setRelatedAccount(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRelated();
  }, [account]);

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
            <div className="card lg:h-[466px]">
              <div className="card-body p-4">
                <Swiper
                  className="rounded-[12px] h-full"
                  modules={[Navigation, Pagination, Autoplay]}
                  loop={account?.image_detail?.length > 1}
                  autoplay={{
                    delay: 3000, // 3 giây đổi ảnh
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
                  <div ref={prevAccount} className="button-prev"></div>
                  <div ref={nextAccount} className="button-next"></div>
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
                <hr className="pb-3 lg:pb-0"/>
                <div className="hidden lg:block text-title py-2">Thông tin acc</div>
                <div className="hidden lg:flex flex-wrap w-full my-0 mx-auto">
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
                <div className="hidden lg:block py-6">
                  <hr />
                </div>
                <button className="hidden lg:block btn w-full">Mua ngay</button>
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
      <section className="section-extra-accounts">
        <div className="section-relate-accounts">
          <h2 className="section-title mb-6">Tài khoản liên quan</h2>
          <div className="relate-swiper-wrapper">
            <Swiper
              modules={[Navigation]}
              slidesPerView={5} // 👈 hiện 5 card
              slidesPerGroup={5} // 👈 bấm 1 lần → trượt 5 card
              spaceBetween={16}
              onSwiper={(swiper) => {
                if (!prevRelate.current || !nextRelate.current) return;

                swiper.params.navigation = {
                  prevEl: prevRelate.current,
                  nextEl: nextRelate.current,
                };

                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {relatedAccount.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="card card-hover">
                    <Link
                      to={`/mua-acc/${category.slug}/${item.slug_detail}`}
                      className="p-4 card-body"
                    >
                      <div className="card-image">
                        <img
                          src={
                            item.image_detail && item.image_detail.length > 0
                              ? item.image_detail[0]
                              : "/no-image.png"
                          }
                          alt="Ảnh game"
                        />
                      </div>
                      <div className="account-info">
                        <div className="account-name text-limit">
                          {category.name}
                        </div>
                        <div className="mb-2">
                          <div className="text-[var(--text-link)] text-[13px] font-normal leading-[20px] mb-2">
                            ID: #{item.slug_detail}
                          </div>
                          {category?.attributes &&
                            item.attributes_detail &&
                            Object.entries(category.attributes).map(
                              ([key, attr]) => (
                                <div
                                  key={key}
                                  className="text-[var(--text-link)] text-[13px] font-normal leading-[20px]"
                                >
                                  {attr.label}:{" "}
                                  {item.attributes_detail[key] ?? ""}
                                </div>
                              )
                            )}
                        </div>
                        <div className="price">
                          <div className="price_current w-full">
                            {new Intl.NumberFormat("vi-VN").format(
                              item.price_detail
                            )}
                            đ
                          </div>
                          <div className="price_old mr-2">
                            {new Intl.NumberFormat("vi-VN").format(
                              item.price_old_detail
                            )}
                            đ
                          </div>
                          <div className="discount">
                            {Math.round(
                              ((item.price_old_detail - item.price_detail) /
                                item.price_old_detail) *
                                100
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div ref={prevRelate} className="button-prev"></div>
            <div ref={nextRelate} className="button-next"></div>
          </div>
        </div>
        <div className="section-watched-accounts">
          <h2 className="section-title mb-6">Tài khoản đã xem</h2>
        </div>
      </section>
    </>
  );
};

export default ChiTietAccount;
