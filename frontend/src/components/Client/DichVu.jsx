import { useEffect, useState, useRef } from "react";
import { Outlet, Link, NavLink, useMatch } from "react-router-dom";
import { FaHouse, FaRegNewspaper, FaHouseCircleCheck } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const DichVu = () => {
  const API = import.meta.env.VITE_API_URL;
  const prevAccount = useRef(null);
  const nextAccount = useRef(null);
  return (
    <>
      <div className="ads-banner-slide lg:mt-4">
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
      <div className="mt-2 mb-2">
        <h3 className="color-[var(--text-title-color: #1B1D29;)] text-[15px] font-bold leading-[24px]">
          Danh mục dịch vụ
        </h3>
      </div>
      <div className="menu-category">
        <ul className="menu-category-list">
          <li className="menu-category-item">
            <Link to="/">
              <div className="menu-category-link">
                <FaHouse className="menu-category-img" />
                <p className="text-[var(--primary-color)] font-normal">
                  Trang chủ
                </p>
              </div>
            </Link>
          </li>
          <li className="menu-category-item">
            <Link to="/mua-acc">
              <div className="menu-category-link">
                <FaHouseCircleCheck className="menu-category-img" />
                <p className="text-[var(--primary-color)] font-normal">
                  Mua Acc
                </p>
              </div>
            </Link>
          </li>
          <li className="menu-category-item">
            <Link to="/tin-tuc">
              <div className="menu-category-link">
                <FaRegNewspaper className="menu-category-img" />
                <p className="text-[var(--primary-color)] font-normal">
                  Tin tức
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DichVu;
