import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

const DanhSachAccount = () => {
  const toLowerFirst = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };
  const toSlug = (str) => {
    return str
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // xoá dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/\s+/g, "_"); // khoảng trắng → _
  };
  const priceMap = {
    "0-50000": "Dưới 50K",
    "50000-200000": "50K - 200K",
    "200000-500000": "200K - 500K",
    "500000-1000000": "500K - 1 Triệu",
    1000000: "Trên 1 Triệu",
    5000000: "Trên 5 Triệu",
    10000000: "Trên 10 Triệu",
  };
  // Xử lý mở tắt modal
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const close = () => {
    setShowEffect(false);
    setTimeout(() => {
      setShowModalFilter(false);
    }, 300);
  };

  useEffect(() => {
    if (showModalFilter) {
      setTimeout(() => {
        setShowEffect(true);
      }, 10);
    }
  }, [showModalFilter]);
  // End Xử lý mở tắt modal

  // Lấy dữ liệu
  const navigate = useNavigate();
  const { slug } = useParams();
  const [sort, setSort] = useState("random");
  const [filters, setFilters] = useState({
    keyword: "",
    code: "",
    price: "0",
    rank: "0",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [categories, setCategories] = useState();
  const [accounts, setAccounts] = useState();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/accounts/${slug}`,
          {
            params: {
              sort,
              find: appliedFilters.keyword,
              id_data: appliedFilters.code,
              price_data: appliedFilters.price,
              ...Object.fromEntries(
                Object.entries(appliedFilters).filter(
                  ([k]) => !["keyword", "code", "price"].includes(k),
                ),
              ),
            },
          },
        );
        setCategories(res.data.categories);
        setAccounts(res.data.accounts);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    };

    fetchUser();
  }, [slug, sort, appliedFilters]);
  // End Lấy dữ liệu

  const location = useLocation();
  useEffect(() => {
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (isReload && location.search) {
      navigate(`/mua-acc/${slug}`, { replace: true });

      const reset = {
        keyword: "",
        code: "",
        price: "0",
        rank: "0",
      };

      setFilters(reset);
      setAppliedFilters(reset);
    }
  }, []);
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
        {categories && (
          <li className="breadcrumb-item">
            <Link to="/mua-acc/" className="breadcrumb-link active">
              {categories.name}
            </Link>
          </li>
        )}
      </ul>
      <section className="account-section">
        <div className="account-title">
          <h2 className="text-title fz-20 fw-700 lh-28 mb-12">
            {categories?.name}
          </h2>
          <hr />
          <div className="filter-account d-flex justify-content-between align-items-center my-16">
            <div className="text-color fz-15 fw-700 lh-24">
              Chọn game muốn mua account
            </div>
            <div className="value-filter">
              <div className="nick-findter-data">
                {Object.entries(appliedFilters).map(([key, value]) => {
                  if (!value || value === "0") return null;

                  let label = value;

                  if (key === "price") {
                    label = priceMap[value] || value;
                  } else if (categories?.attributes?.[key]) {
                    const attr = categories.attributes[key];

                    if (attr.type === "select") {
                      const found = attr.options?.find(
                        (opt) => toSlug(opt) === value,
                      );

                      label = found || value;
                    }
                  }

                  return (
                    <div
                      className="tag"
                      key={key}
                      onClick={() => {
                        const newFilters = {
                          ...appliedFilters,
                          [key]: "0",
                        };

                        setFilters(newFilters);
                        setAppliedFilters(newFilters);

                        // 👉 build lại URL
                        const params = new URLSearchParams();

                        if (newFilters.keyword)
                          params.set("find", newFilters.keyword);
                        if (newFilters.code)
                          params.set("id_data", newFilters.code);
                        if (newFilters.price !== "0")
                          params.set("price_data", newFilters.price);

                        Object.entries(newFilters).forEach(([k, v]) => {
                          if (
                            !["keyword", "code", "price"].includes(k) &&
                            v !== "0"
                          ) {
                            params.set(k, v);
                          }
                        });

                        navigate(
                          `/mua-acc/${slug}${params.toString() ? "?" + params.toString() : ""}`,
                        );
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
              <div
                className="show-modal-filter"
                onClick={() => {
                  setShowModalFilter(true);
                }}
              >
                Tìm kiếm
              </div>
              {showModalFilter && (
                <>
                  <div
                    className={`modal fade ${showEffect ? "show" : ""}`}
                    style={{
                      display: showModalFilter ? "block" : "none",
                    }}
                    onClick={close}
                  >
                    <div
                      className="modal-dialog"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content">
                        <form className="form-filter">
                          <div className="modal-header">
                            <p className="fz-15 fw-700 lh-24 w-100 text-center">
                              Tìm kiếm
                            </p>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={close}
                            ></button>
                          </div>
                          <div className="modal-body p-0">
                            <div className="input-group mb-8">
                              <label
                                htmlFor=""
                                className="fw-500 title-color mb-4"
                              >
                                Tìm kiếm
                              </label>
                              <input
                                type="text"
                                placeholder="Nhập skin,tên tướng,level..."
                                value={filters.keyword}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    keyword: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="input-group mb-8">
                              <label
                                htmlFor=""
                                className="fw-500 title-color mb-4"
                              >
                                Mã số
                              </label>
                              <input
                                type="text"
                                placeholder="Nhập mã số nick"
                                value={filters.code}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    code: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="input-group mb-8">
                              <label
                                htmlFor=""
                                className="fw-500 title-color mb-4"
                              >
                                Giá tiền
                              </label>
                              <select
                                name=""
                                id=""
                                value={filters.price}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    price: e.target.value,
                                  })
                                }
                              >
                                <option value="0">Chọn giá tiền</option>
                                <option value="0-50000">Dưới 50K</option>
                                <option value="50000-200000">
                                  Từ 50K đến 200K
                                </option>
                                <option value="200000-500000">
                                  Từ 200K đến 500K
                                </option>
                                <option value="500000-1000000">
                                  Từ 500k đến 1 Triệu
                                </option>
                                <option value="1000000">Trên 1 Triệu</option>
                                <option value="5000000">Trên 5 Triệu</option>
                                <option value="10000000">Trên 10 Triệu</option>
                              </select>
                            </div>
                            {categories?.attributes &&
                              Object.entries(categories.attributes).map(
                                ([key, attr]) => {
                                  if (attr.type !== "select") return null; // ❌ bỏ qua number, text

                                  return (
                                    <div className="input-group mb-8" key={key}>
                                      <label className="fw-500 title-color mb-4">
                                        {attr.label}
                                      </label>
                                      <select
                                        value={filters[key] || "0"}
                                        onChange={(e) =>
                                          setFilters({
                                            ...filters,
                                            [key]: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="0">
                                          Chọn {toLowerFirst(attr.label)}
                                        </option>
                                        {attr.options?.map((opt, index) => (
                                          <option
                                            key={index}
                                            value={toSlug(opt)}
                                          >
                                            {opt}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  );
                                },
                              )}
                          </div>
                          <div className="modal-footer mt-24">
                            <button
                              className="btn ghost"
                              onClick={(e) => {
                                e.preventDefault();
                                const reset = {
                                  keyword: "",
                                  code: "",
                                  price: "0",
                                  rank: "0",
                                };

                                setFilters(reset); // 👈 chỉ reset form
                              }}
                            >
                              Xoá tìm kiếm
                            </button>
                            <button
                              className="btn primary"
                              onClick={(e) => {
                                e.preventDefault();

                                setAppliedFilters(filters);

                                // 👉 build query string
                                const params = new URLSearchParams();

                                if (filters.keyword)
                                  params.set("find", filters.keyword);
                                if (filters.code)
                                  params.set("id_data", filters.code);
                                if (filters.price !== "0")
                                  params.set("price_data", filters.price);

                                // dynamic attributes
                                Object.entries(filters).forEach(
                                  ([key, value]) => {
                                    if (
                                      !["keyword", "code", "price"].includes(
                                        key,
                                      ) &&
                                      value !== "0"
                                    ) {
                                      params.set(`${key}`, value);
                                    }
                                  },
                                );

                                navigate(
                                  `/mua-acc/${slug}?${params.toString()}`,
                                );

                                close();
                              }}
                            >
                              Xem kết quả
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`modal-backdrop fade ${showEffect ? "show" : ""}`}
                  ></div>
                </>
              )}
            </div>
          </div>
          <div className="sort-account mb-16 d-none d-lg-flex">
            <div className="text-color fz-15 fw-700 lh-24">
              {total} sản phẩm
            </div>
            <div className="value-sort d-flex align-items-center">
              <div className="text-color fz-15 fw-700 lh-24 mr-16">
                Sắp xếp theo:
              </div>
              <div>
                <span
                  className={`selection mr-4 ${sort === "random" ? "active" : ""}`}
                  onClick={() => setSort("random")}
                >
                  Ngẫu nhiên
                </span>
                <span
                  className={`selection mr-4 ${sort === "price_desc" ? "active" : ""}`}
                  onClick={() => setSort("price_desc")}
                >
                  Giá từ cao đến thấp
                </span>
                <span
                  className={`selection mr-4 ${sort === "price_asc" ? "active" : ""}`}
                  onClick={() => setSort("price_asc")}
                >
                  Giá từ thấp đến cao
                </span>
                <span
                  className={`selection mr-4 ${sort === "newest" ? "active" : ""}`}
                  onClick={() => setSort("newest")}
                >
                  Mới nhất
                </span>
                <span
                  className={`selection ${sort === "oldest" ? "active" : ""}`}
                  onClick={() => setSort("oldest")}
                >
                  Cữ nhất
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="account-list">
          {accounts?.map((item) => (
            <div className="account-item" key={item._id}>
              <div className="card card-hover">
                <Link
                  to={`/mua-acc/${slug}/${item._id}`}
                  className="card-body scale-thumb"
                >
                  <div className="account-thumb mb-8">
                    <img src={item.avatar} alt={item.name} />
                  </div>
                  <div className="account-title">
                    <div className="text-title fz-15 fw-700 lh-24 text-limit limit-1">
                      {categories.name}
                    </div>
                  </div>
                  <div className="account-info mb-8">
                    <div className="info-attr mb-8">ID: #{item._id}</div>
                    {categories?.attributes &&
                      item.attributes &&
                      Object.entries(categories.attributes).map(
                        ([key, attr]) => (
                          <div key={key} className="info-attr">
                            {attr.label}: {item.attributes?.[key] ?? ""}
                          </div>
                        ),
                      )}
                  </div>
                  <div className="price">
                    <div
                      className={`price_current w-100 ${
                        !(item?.price_sale > 0) ? "mb-16" : ""
                      }`}
                    >
                      {new Intl.NumberFormat("vi-VN").format(
                        item?.price_sale > 0 ? item.price_sale : item.price,
                      )}
                      đ
                    </div>

                    {/* Chỉ hiện khi price_sale > 0 */}
                    {item?.price_sale > 0 && (
                      <div className="price_old mr-8">
                        {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                      </div>
                    )}

                    {/* Chỉ hiện khi price_sale > 0 */}
                    {item?.price_sale > 0 && (
                      <div className="discount">
                        {Math.round(
                          ((item.price - item.price_sale) / item.price) * 100,
                        )}
                        %
                      </div>
                    )}
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
