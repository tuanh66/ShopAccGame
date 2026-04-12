import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MuaAcc = () => {
  // Lấy dữ liệu
  const [categories, setCategories] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };

    fetchUser();
  }, []);
  // End Lấy dữ liệu

  // const openAds = () => {
  //   window.open("https://omg10.com/4/10737369", "_blank");
  // };
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/mua-acc" className="breadcrumb-link active">
            Mua Account
          </Link>
        </li>
      </ul>
      <div className="account-section">
        <div className="account-title">
          <h2 className="text-title fz-20 fw-700 lh-28 pb-12">
            Danh sách tất cả các Acc Game
          </h2>
          <hr />
          <div className="text-color fz-15 fw-700 lh-24 py-16">
            Chọn game muốn mua account
          </div>
        </div>
        <div className="account-list">
          {categories?.map((item) => (
            <div className="account-item" key={item.slug}>
              <div className="card card-hover">
                <Link
                  to={`/mua-acc/${item.slug}`}
                  className="card-body scale-thumb"
                  // onClick={openAds}
                >
                  <div className="account-thumb mb-8">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="account-title">
                    <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                      {item.name}
                    </div>
                  </div>
                  <div className="account-info">
                    <div className="info-attr">
                      Số tài khoản:{" "}
                      {(item.totalAccount || 0).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MuaAcc;
