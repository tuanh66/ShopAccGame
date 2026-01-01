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
            <Link
              to={`/mua-acc/${category.slug}`}
              className="breadcrumb-link"
            >
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
    </>
  );
};

export default ChiTietAccount;
