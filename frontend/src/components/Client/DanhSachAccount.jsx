import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const DanhSachAccount = () => {
  const API = import.meta.env.VITE_API_URL;
  const { slugCategory } = useParams();
  const [account, setAccount] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(`${API}/account/category/${slugCategory}`);

        setAccount(res.data.data);
        setCategory(res.data.category);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccounts();
  }, [slugCategory]);
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
      </ul>
      <section className="account-section">
        <div className="account-header">
          <h2 className="text-[20px] font-bold leading-[28px]">
            {category?.name}
          </h2>
        </div>
        <hr />
        <div className="py-4 text-[15px] font-bold leading-[24px]">
          Chọn game muốn mua account
        </div>
        <div className="account-list">
          {account.map((item) => (
            <div className="account-item" key={item._id}>
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
                              {attr.label}: {item.attributes_detail[key] ?? ""}
                            </div>
                          )
                        )}
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
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default DanhSachAccount;
