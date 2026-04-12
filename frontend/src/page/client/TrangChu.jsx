import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import star_top from "../../assets/img/star-top.png";
import star from "../../assets/img/star.png";
import banner_test from "../../assets/img/bannertest.png";

const TrangChu = () => {
  const prevAccount = useRef(null);
  const nextAccount = useRef(null);
  return (
    <>
      <div className="ads-banner row">
        <div className="content-banner-card col-lg-3 col-md-12">
          <div className="card h-100">
            <div className="pt-16 text-center d-flex justify-content-center align-items-center">
              <div className="pr-5">
                <img src={star_top} alt="Star Top" />
              </div>
              <span className="fz-16 fw-700">TOP NẠP THẺ THÁNG 3</span>
            </div>
            <div className="content-top-card mt-16">
              <div className="topup-user-rank">
                <div className="topup-user-icon"></div>
                <div className="topup-user-name">****dem6x</div>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <div className="topup-user-icon"></div>
                <div className="topup-user-name">****dem6x</div>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <div className="topup-user-icon"></div>
                <div className="topup-user-name">****dem6x</div>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <div className="topup-user-number">4</div>
                <div className="topup-user-name">****dem6x</div>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <div className="topup-user-number">5</div>
                <div className="topup-user-name">****dem6x</div>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="banner-slide col-lg-9 col-md-12">
          <Swiper
            className="account-swiper swiper-container-horizontal h-100 brs-12"
            style={{ cursor: "grab" }}
            modules={[Navigation, Pagination, Autoplay]}
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
            <SwiperSlide className="account-slide">
              <img src={banner_test} alt="" className="account-image" />
            </SwiperSlide>
            <SwiperSlide className="account-slide">
              <img src={banner_test} alt="" className="account-image" />
            </SwiperSlide>
            <div
              ref={prevAccount}
              className="button-prev d-none d-lg-block"
            ></div>
            <div
              ref={nextAccount}
              className="button-next d-none d-lg-block"
            ></div>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default TrangChu;
