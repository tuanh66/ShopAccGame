import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { discountCodeService } from "../../service/discountCodeService";

const DiscountCodeCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: 0,
    maxDiscount: 0,
    minOrderValue: 0,
    maxUses: 0,
    maxUsesPerUser: 0,
    applyTo: "all",
    expirationDate: "",
    status: "true",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate bắt buộc
    if (!form.type || form.value === "") {
      toast.error("Vui lòng nhập kiểu và giá trị giảm giá");
      return;
    }

    try {
      const submitData = {
        ...form,
        value: Number(form.value) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        minOrderValue: Number(form.minOrderValue) || 0,
        maxUses: Number(form.maxUses) || 0,
        maxUsesPerUser: Number(form.maxUsesPerUser) || 0,
      };
      await discountCodeService.createDiscountCode(submitData);
      toast.success("Tạo mã giảm giá thành công");
      navigate("/admin/discount-code");
    } catch (error) {
      console.error("Lỗi khi tạo mã giảm giá", error);
      const msg = error.response?.data?.message || "Tạo mã giảm giá thất bại";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Thêm Mã Giảm Giá</h4>
          <span>Tạo mã giảm giá mới</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-discount-code" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="code">
                  Mã giảm giá
                  <span>*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  placeholder="Để trống để tạo mã tự động"
                  className="input-form"
                  value={form.code}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="type">
                  Kiểu
                  <span>*</span>
                </label>
                <select
                  name="type"
                  id="type"
                  className="select-form"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="value">
                  {form.type === "percent" ? "Giá trị (%)" : "Giá trị (VNĐ)"}
                  <span>*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  id="value"
                  className="input-form"
                  value={form.value}
                  onChange={handleChange}
                />
              </div>

              {form.type === "percent" && (
                <div className="col-lg-6 col-sm-6 col-12 form-group">
                  <label htmlFor="maxDiscount">
                    Giảm tối đa (0 = không giới hạn)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    id="maxDiscount"
                    className="input-form"
                    value={form.maxDiscount}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="minOrderValue">Số tiền mua tối thiểu</label>
                <input
                  type="number"
                  name="minOrderValue"
                  id="minOrderValue"
                  className="input-form"
                  value={form.minOrderValue}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="maxUses">
                  Lượt sử dụng tối đa (để trống = không giới hạn)
                </label>
                <input
                  type="number"
                  name="maxUses"
                  id="maxUses"
                  className="input-form"
                  value={form.maxUses}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="maxUsesPerUser">
                  Giới hạn lượt dùng mỗi người (để trống = không giới hạn)
                </label>
                <input
                  type="number"
                  name="maxUsesPerUser"
                  id="maxUsesPerUser"
                  className="input-form"
                  value={form.maxUsesPerUser}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="applyTo">Áp dụng cho</label>
                <select
                  name="applyTo"
                  id="applyTo"
                  className="select-form"
                  value={form.applyTo}
                  onChange={handleChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="account">Tài khoản</option>
                  <option value="random">Random tài khoản</option>
                </select>
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="expirationDate">
                  Ngày hết hạn (để trống = không hết hạn)
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  id="expirationDate"
                  className="input-form"
                  value={form.expirationDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="status">
                  Trạng thái
                  <span>*</span>
                </label>
                <select
                  name="status"
                  id="status"
                  className="select-form"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              <div className="col-lg-12 form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  name="description"
                  id="description"
                  className="input-form"
                  style={{ height: "100px" }}
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Tạo mới
                </button>
                <Link to="/admin/discount-code" className="btn btn-cancel">
                  Quay lại
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DiscountCodeCreate;
