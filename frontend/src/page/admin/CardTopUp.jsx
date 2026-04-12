import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { paymentService } from "../../service/paymentService";
import { useUIStore } from "../../store/useUIStore";

const CardTopUp = () => {
  const [formData, setFormData] = useState({
    partner: "",
    discount: "",
    partnerId: "",
    partnerKey: "",
  });

  const setGlobalLoading = useUIStore((s) => s.setGlobalLoading);

  useEffect(() => {
    const fetchConfig = async () => {
      setGlobalLoading(true);
      try {
        const res = await paymentService.readCardTopUp();
        if (res.data) {
          setFormData({
            partner: res.data.partner || "",
            discount: res.data.discount || "",
            partnerId: res.data.partnerId || "",
            partnerKey: res.data.partnerKey || "",
          });
        }
      } catch (error) {
        console.error("Lỗi lấy cấu hình nạp thẻ:", error);
      } finally {
        setGlobalLoading(false);
      }
    };
    fetchConfig();
  }, [setGlobalLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);
    try {
      await paymentService.updateCardTopUp(formData);
      toast.success("Cập nhật cấu hình nạp thẻ thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật cấu hình:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Quản lý tài khoản nạp thẻ</h4>
          <span>Xem và quản lý tài khoản nạp thẻ</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-card-top-up" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="partner">
                  Website đối tác<span>*</span>
                </label>
                <select
                  name="partner"
                  id="partner"
                  value={formData.partner}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Chọn đối tác--</option>
                  <option value="thesieure.com">THESIEURE.COM</option>
                  <option value="cardvip.vn">CARDVIP.VN</option>
                  <option value="doithe1s.com">DOITHE1S.COM</option>
                </select>
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="discount">
                  Chiết khấu nạp thẻ (%)<span>*</span>
                </label>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="Nhập chiết khấu nạp thẻ"
                  required
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="partnerId">
                  Partner ID<span>*</span>
                </label>
                <input
                  type="text"
                  id="partnerId"
                  name="partnerId"
                  value={formData.partnerId}
                  onChange={handleChange}
                  placeholder="Nhập Partner ID"
                  required
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="partnerKey">
                  Partner Key<span>*</span>
                </label>
                <input
                  type="text"
                  id="partnerKey"
                  name="partnerKey"
                  value={formData.partnerKey}
                  onChange={handleChange}
                  placeholder="Nhập Partner Key"
                  required
                />
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Cập nhật
                </button>
                <Link
                  to="/admin/card-top-up/history"
                  className="btn btn-cancel"
                >
                  Lịch sử nạp thẻ
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CardTopUp;
