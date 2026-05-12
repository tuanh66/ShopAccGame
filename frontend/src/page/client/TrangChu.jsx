import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import star_top from "../../assets/img/star-top.png";
import banner_test from "../../assets/img/bannertest.png";
import accGameIcon from "../../assets/img/acc-game.png";

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
            <div className="px-15">
              <Link
                to="/nap-tien"
                className="btn primary w-100 mb-12"
                style={{ height: "auto" }}
              >
                <span className="fz-13" style={{ textTransform: "none" }}>
                  Nạp thẻ ngay
                </span>
              </Link>
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
      <div className="category-icons-container brs-8">
        <Link
          to="https://zalo.me/0702775297"
          className="category-icon-item"
          target="_blank"
        >
          <div className="icon-box">
            <img
              src="https://static2.mingame88.com/19426957-cdnimaget1/upload/images/ChatGPT%20Image%2023_57_43%209%20thg%205%2C%202025.png"
              alt="Thu Acc"
            />
          </div>
          <span className="fz-13 fw-400 lh-20 text-color">
            THU ACC THANH LÝ ALL GAME
          </span>
        </Link>
        <Link to="/mua-acc/lien-quan" className="category-icon-item">
          <div className="icon-box">
            <img
              src="https://static2.mingame88.com/19426957-cdnimaget1/upload/images/chuacoten-2.png"
              alt="Acc LQ"
            />
          </div>
          <span className="fz-13 fw-400 lh-20 text-color">
            ACC LIÊN QUÂN SALE
          </span>
        </Link>
        <Link to="/mua-acc/blox-fruit" className="category-icon-item">
          <div className="icon-box">
            <img
              src="http://static2.mingame88.com/19426957-cdnimaget1/upload/images/qqqq.png"
              alt="Blox Fruit"
            />
          </div>
          <span className="fz-13 fw-400 lh-20 text-color">
            ACC BLOX FRUITS GIÁ RẺ
          </span>
        </Link>
        <Link to="/mua-acc/free-fire" className="category-icon-item">
          <div className="icon-box">
            <img
              src="https://static2.mingame88.com/19426957-cdnimaget1/upload/images/freefire-max.png"
              alt="Free Fire"
            />
          </div>
          <span className="fz-13 fw-400 lh-20 text-color">
            ACC FREE FIRE GIÁ RẺ
          </span>
        </Link>
        <Link to="/mua-acc/tft" className="category-icon-item">
          <div className="icon-box">
            <img
              src="https://static2.mingame88.com/19426957-cdnimaget1/upload/images/thiet-ke-4.png"
              alt="TFT"
            />
          </div>
          <span className="fz-13 fw-400 lh-20 text-color">
            ACC TFT ĐTCL GIÁ RẺ
          </span>
        </Link>
        <Link to="/mua-acc/grow-a-garden" className="category-icon-item">
          <div className="icon-box">
            <img
              src="https://static2.mingame88.com/19426957-cdnimaget1/upload/images/Screenshot_105.png"
              alt="Grow Garden"
            />
          </div>
          <span className="fz-13 fw-400 lh-20 text-color">
            ACC GROW A GARDEN
          </span>
        </Link>
      </div>
      <section className="section-related-service pt-32">
        <div className="section-header justify-content-between mb-8 lg-mb-16">
          <h2 className="section-title lg-fz-15 lg-lg-24">
            <i
              className="icon-title mr-8"
              style={{ "--path": `url(${accGameIcon})` }}
            ></i>{" "}
            KHO NICK LIÊN QUÂN
          </h2>
          <Link to="#" className="link relative pr-20">
            Xem tất cả
          </Link>
        </div>
        <div className="account-list">
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div
        className="pt-8 lg-pt-16"
        style={{ borderBottom: "1px solid #BCBFD6" }}
      ></div>
      <section className="section-related-service pt-32">
        <div className="section-header justify-content-between mb-8 lg-mb-16">
          <h2 className="section-title lg-fz-15 lg-lg-24">
            <i
              className="icon-title mr-8"
              style={{ "--path": `url(${accGameIcon})` }}
            ></i>{" "}
            KHO NICK LIÊN QUÂN
          </h2>
          <Link to="#" className="link relative pr-20">
            Xem tất cả
          </Link>
        </div>
        <div className="account-list">
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div
        className="pt-8 lg-pt-16"
        style={{ borderBottom: "1px solid #BCBFD6" }}
      ></div>
      <section className="section-related-service pt-32">
        <div className="section-header justify-content-between mb-8 lg-mb-16">
          <h2 className="section-title lg-fz-15 lg-lg-24">
            <i
              className="icon-title mr-8"
              style={{ "--path": `url(${accGameIcon})` }}
            ></i>{" "}
            KHO NICK LIÊN QUÂN
          </h2>
          <Link to="#" className="link relative pr-20">
            Xem tất cả
          </Link>
        </div>
        <div className="account-list">
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="account-item px-8 lg-px-6 mb-12">
            <div className="card">
              <Link to="#" className="card-body p-16 lg-p-12 scale-thumb">
                <div className="account-thumb mb-8">
                  <img
                    src="https://i.ibb.co/tM6sHzWt/ACC-LQ-TTT-0-A40-C30-1.gif"
                    alt=""
                  />
                </div>
                <div className="account-title">
                  <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                    Nick Liên Quân Trắng Thông Tin
                  </div>
                </div>
                <div className="account-info">
                  <div className="info-attr">Số tài khoản: 6</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TrangChu;
