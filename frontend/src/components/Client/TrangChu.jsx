import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const TrangChu = () => {
  const API = import.meta.env.VITE_API_URL;
  const prevAccount = useRef(null);
  const nextAccount = useRef(null);
  return (
    <>
      <div className="">
        <div className="ads-banner">
          <div className="ads-banner-card">
            <div></div>
          </div>
          <div className="ads-banner-slide">
            <Swiper
              className="rounded-[12px] h-[366px]"
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
      </div>
    </>
  );
};

export default TrangChu;
