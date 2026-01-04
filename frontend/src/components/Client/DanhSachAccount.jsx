import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useSearchParams } from "react-router-dom";

const DanhSachAccount = () => {
  const API = import.meta.env.VITE_API_URL;
  const { slugCategory } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [pagination, setPagination] = useState(null);
  const [account, setAccount] = useState([]);
  const [category, setCategory] = useState(null);

  const getPages = (page, totalPages) => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // luôn có trang đầu
    pages.push(1);

    // --- LEFT ---
    if (page >= 5) {
      pages.push("...");
    }

    // pages giữa
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // --- RIGHT ---
    if (page <= totalPages - 4) {
      pages.push("...");
    }

    // luôn có trang cuối
    pages.push(totalPages);

    return pages;
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          `${API}/account/category/${slugCategory}?page=${page}`
        );

        setAccount(res.data.data);
        setCategory(res.data.category);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccounts();
  }, [slugCategory, page]);
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
                    </div>
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
                </Link>
              </div>
            </div>
          ))}
          {pagination && pagination.totalPages > 1 && (
            <div className="pt-6 w-full">
              <ul className="pagination">
                {/* PREV  */}
                <li className={`page-item pre-2 ${page < 6 ? "disabled" : ""}`}>
                  {page === 6 ? (
                    <span className="page-link"></span>
                  ) : (
                    <Link to={`?page=1`} className="page-link"></Link>
                  )}
                </li>
                <li
                  className={`page-item pre-1 ${page === 1 ? "disabled" : ""}`}
                >
                  {page === 1 ? (
                    <span className="page-link"></span>
                  ) : (
                    <Link to={`?page=${page - 1}`} className="page-link"></Link>
                  )}
                </li>

                {/* PAGE NUMBERS */}
                {getPages(page, pagination.totalPages).map((p, index) => {
                  // DẤU ...
                  if (p === "...") {
                    return (
                      <li key={index} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }

                  // PAGE ACTIVE
                  if (p === page) {
                    return (
                      <li key={index} className="page-item active">
                        <span className="page-link">{p}</span>
                      </li>
                    );
                  }

                  // PAGE BÌNH THƯỜNG
                  return (
                    <li key={index} className="page-item">
                      <Link to={`?page=${p}`} className="page-link">
                        {p}
                      </Link>
                    </li>
                  );
                })}

                {/* NEXT */}
                <li
                  className={`page-item next-1 ${
                    page === pagination.totalPages ? "disabled" : ""
                  }`}
                >
                  {page === pagination.totalPages ? (
                    <span className="page-link"></span>
                  ) : (
                    <Link to={`?page=${page + 1}`} className="page-link"></Link>
                  )}
                </li>
                <li
                  className={`page-item next-2 ${
                    page === pagination.totalPages ? "disabled" : ""
                  }`}
                >
                  {page === pagination.totalPages ? (
                    <span className="page-link"></span>
                  ) : (
                    <Link
                      to={`?page=${pagination.totalPages}`}
                      className="page-link"
                    ></Link>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DanhSachAccount;
