import { useState } from 'react';

const DiscountCodeCreate = () => {
  const [type, setType] = useState('percentage');

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
          <form className="form-discount-code">
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
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="value">
                  {type === 'percentage' ? 'Giá trị (%)' : 'Giá trị (VNĐ)'}
                  <span>*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  id="value"
                  className="input-form"
                />
              </div>

              {type === 'percentage' && (
                <div className="col-lg-6 col-sm-6 col-12 form-group">
                  <label htmlFor="maxDiscount">
                    Giảm tối đa (0 = không giới hạn)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    id="maxDiscount"
                    defaultValue={0}
                    className="input-form"
                  />
                </div>
              )}

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="minOrderValue">
                  Số tiền mua tối thiểu
                </label>
                <input
                  type="number"
                  name="minOrderValue"
                  id="minOrderValue"
                  defaultValue={0}
                  className="input-form"
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
                />
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="applyTo">
                  Áp dụng cho
                </label>
                <select name="applyTo" id="applyTo" className="select-form">
                  <option value="all">Tất cả</option>
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
                />
              </div>

              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="status">
                  Trạng thái
                  <span>*</span>
                </label>
                <select name="status" id="status" className="select-form">
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="col-lg-12 col-sm-12 col-12 form-group">
                <label htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="input-form"
                  rows={4}
                ></textarea>
              </div>

              <div className="col-lg-12 col-sm-12 col-12 form-group" style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-submit" style={{ backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
                  Tạo mã giảm giá
                </button>
                <button type="button" className="btn btn-cancel" style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
                  Hủy
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DiscountCodeCreate;
