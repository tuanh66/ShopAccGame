import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import star_top from "../../assets/img/star-top.png";

const TrangChu = () => {
  const API = import.meta.env.VITE_API_URL;
  const prevAccount = useRef(null);
  const nextAccount = useRef(null);
  return (
    <>
      <div className="ads-banner">
        <div className="ads-banner-card">
          <div className="card">
            <div className="banner-card-title">
              <span className="pr-[5px]">
                <img src={star_top} alt="icon" />
              </span>
              <span className="text-[var(--text-title-color)] text-[16px] font-bold">
                TOP NẠP THẺ THÁNG 1
              </span>
            </div>
            <div className="mt-4 h-full min-h-[200px]">
              <div className="topup-user-rank">
                <span className="topup-user-icon"></span>
                <span className="topup-user-name">****dem6x</span>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <span className="topup-user-icon"></span>
                <span className="topup-user-name">****dem6x</span>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <span className="topup-user-icon"></span>
                <span className="topup-user-name">****dem6x</span>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <span className="topup-user-number">4</span>
                <span className="topup-user-name">****dem6x</span>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
              <div className="topup-user-rank">
                <span className="topup-user-number">5</span>
                <span className="topup-user-name">****dem6x</span>
                <label className="topup-user-amount">
                  2.800.000<sup>đ</sup>
                </label>
              </div>
            </div>
            <div className="px-[15px] mb-3">
              <Link to="nap-tien">
                <div className="btn">Nap thẻ ngay</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="ads-banner-slide">
          <Swiper
            className="rounded-[12px]"
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
            <SwiperSlide>
              <img
                src="https://static2.mingame89.store/19426957-cdnimaget1/upload/images/XJM4DbjqYM_1688039729%20(1).png"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://static2.mingame89.store/19426957-cdnimaget1/upload/images/105A%20ngo%2012%20Phan%20Van%20Tru%E1%BB%9Dng(1).png"
                alt=""
              />
            </SwiperSlide>

            <div ref={prevAccount} className="button-prev"></div>
            <div ref={nextAccount} className="button-next"></div>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default TrangChu;
