import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../assets/css/Client/muaacc.css";

const MuaAccount = () => {
  const API = import.meta.env.VITE_API_URL;
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/account/category`)
      .then((res) => {
        setCategory(res.data.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy category", err);
      });
  }, []);

  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <a href="/" className="breadcrumb-link">
            Trang chủ
          </a>
        </li>
        <li className="breadcrumb-item">
          <a href="/mua-acc" className="breadcrumb-link">
            Mua Account
          </a>
        </li>
      </ul>
      <section className="account-section">
        <div className="account-header">
          <h2 className="text-[20px] font-bold leading-[28px]">
            Danh sách tất cả các Acc Game
          </h2>
        </div>
        <hr />
        <div className="py-4 text-[15px] font-bold leading-[24px]">
          Chọn game muốn mua account
        </div>
        <div className="account-list">
          {category.map((item) => (
            <div className="account-item" key={item._id}>
              <div className="card card-hover">
                <Link
                  to={`/mua-acc/${item.slug_category}`}
                  className="p-4 card-body"
                >
                  <div className="card-image">
                    <img src={item.image_category} alt="Ảnh game" />
                  </div>
                  <div className="account-info">
                    <div className="account-name text-limit">
                      {item.name_category}
                    </div>
                    <div className="text-[var(--text-link)] text-[13px] font-normal leading-[20px]">
                      Số tài khoản: {item.count}
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

export default MuaAccount;
