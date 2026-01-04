import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const ChiTietAccount = () => {
  const API = import.meta.env.VITE_API_URL;
  const { slugCategory, slugDetail } = useParams();
  const [account, setAccount] = useState(null);
  const [category, setCategory] = useState(null);

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
          <div className="section-content-left"></div>
          <div className="section-content-right">
            <div className="card">
              <div className="card-body">
                <div className="section-title">{category?.name}</div>
                <div className="text-title !font-bold !mb-[6px]">
                  Mã số: #{account?.slug_detail}
                </div>
                <hr />
                <div className="text-title py-2">Thông tin acc</div>
                <div></div>
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
                <div className="mb-4">
                  <button className="btn w-full">Mua ngay</button>
                </div>
                <div className="w-full mb-4">
                  <p className="text-center text-[var(--text-link)]">--- hoặc ---</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChiTietAccount;
