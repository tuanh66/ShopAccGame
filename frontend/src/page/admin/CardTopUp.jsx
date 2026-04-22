import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { paymentService } from "../../service/paymentService";
import { useUIStore } from "../../store/useUIStore";
import search from "../../assets/svg/search.svg";
import icon_edit from "../../assets/svg/edit.svg";
import icon_delete from "../../assets/svg/delete.svg";

const CardTopUp = () => {
  const [formData, setFormData] = useState({
    partner: "",
    discount: "",
    partner_id: "",
    partner_key: "",
  });

  const [telecomList, setTelecomList] = useState([]);
  const [telecomForm, setTelecomForm] = useState({
    name: "",
    amounts: "",
  });

  const setGlobalLoading = useUIStore((s) => s.setGlobalLoading);

  const fetchConfig = async () => {
    try {
      const res = await paymentService.readCardTopUp();
      if (res.data) {
        setFormData({
          partner: res.data.partner || "",
          discount: res.data.discount ?? 0,
          partner_id: res.data.partner_id || "",
          partner_key: res.data.partner_key || "",
        });
      }
    } catch (error) {
      console.error("Lỗi lấy cấu hình nạp thẻ:", error);
    }
  };

  const fetchTelecoms = async () => {
    try {
      const res = await paymentService.readTelecom();
      if (res.data) {
        setTelecomList(res.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách nhà mạng:", error);
    }
  };

  useEffect(() => {
    setGlobalLoading(true);
    Promise.all([fetchConfig(), fetchTelecoms()]).finally(() => {
      setGlobalLoading(false);
    });
  }, [setGlobalLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);

    const dataToSubmit = {
      ...formData,
      discount: formData.discount === "" ? 0 : Number(formData.discount),
    };

    try {
      const res = await paymentService.updateCardTopUp(dataToSubmit);
      if (res.data) {
        setFormData({
          partner: res.data.partner || "",
          discount: res.data.discount ?? 0,
          partner_id: res.data.partner_id || "",
          partner_key: res.data.partner_key || "",
        });
      }
      toast.success("Cập nhật cấu hình nạp thẻ thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật cấu hình:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleTelecomChange = (e) => {
    let { name, value } = e.target;
    if (name === "amounts") {
      value = value
        .split(",")
        .map((part) => {
          let numStr = part.replace(/\D/g, ""); // Chỉ lấy các chữ số
          if (numStr) {
            let formatted = Number(numStr).toLocaleString("vi-VN");
            // Giữ lại khoảng trắng đứng trước và sau (nếu có)
            let prefixMatches = part.match(/^\s+/);
            let suffixMatches = part.match(/\s+$/);
            let prefix = prefixMatches ? prefixMatches[0] : "";
            let suffix = suffixMatches ? suffixMatches[0] : "";
            return prefix + formatted + suffix;
          }
          // Nếu phần tử không chứa chữ số, chỉ trả về các ký tự khoảng trắng
          return part.replace(/[^\s]/g, "");
        })
        .join(",");
    }
    setTelecomForm({ ...telecomForm, [name]: value });
  };

  const handleTelecomSubmit = async (e) => {
    e.preventDefault();
    if (!telecomForm.name || !telecomForm.amounts) {
      toast.error("Vui lòng điền đủ thông tin nhà mạng!");
      return;
    }

    const amountArray = telecomForm.amounts
      .split(",")
      .map((val) => Number(val.replace(/\./g, "").trim()))
      .filter((val) => !isNaN(val) && val > 0);

    if (amountArray.length === 0) {
      toast.error("Định dạng giá trị thẻ không hợp lệ!");
      return;
    }

    setGlobalLoading(true);
    try {
      await paymentService.createTelecom({
        name: telecomForm.name.toUpperCase(),
        amounts: amountArray,
      });
      toast.success("Thêm nhà mạng thành công!");
      setTelecomForm({ name: "", amounts: "" });
      fetchTelecoms();
    } catch (error) {
      console.error("Lỗi tạo nhà mạng:", error);
      toast.error("Thêm nhà mạng thất bại!");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleDeleteTelecom = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhà mạng này không?")) return;
    setGlobalLoading(true);
    try {
      await paymentService.deleteTelecom(id);
      toast.success("Xóa nhà mạng thành công!");
      fetchTelecoms();
    } catch (error) {
      console.error("Lỗi xóa nhà mạng:", error);
      toast.error("Xóa thất bại!");
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
                  <option value="doithe1s.vn">DOITHE1S.VN</option>
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
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="partnerId">
                  Partner ID<span>*</span>
                </label>
                <input
                  type="text"
                  id="partner_id"
                  name="partner_id"
                  value={formData.partner_id}
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
                  id="partner_key"
                  name="partner_key"
                  value={formData.partner_key}
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
      <div className="card">
        <div className="card-body">
          <form className="form-telecom" onSubmit={handleTelecomSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="telco_name">
                  Tên nhà mạng<span>*</span>
                </label>
                <input
                  type="text"
                  id="telco_name"
                  name="name"
                  value={telecomForm.name}
                  onChange={handleTelecomChange}
                  placeholder="Nhập tên nhà mạng"
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="telco_amounts">
                  Giá trị thẻ<span>*</span>
                </label>
                <input
                  type="text"
                  id="telco_amounts"
                  name="amounts"
                  value={telecomForm.amounts}
                  onChange={handleTelecomChange}
                  placeholder="Nhập giá trị (10000, 20000...)"
                />
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary" type="submit">
                  Thêm mới
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form
            className="mobi-search"
            style={{ width: "200px", marginBottom: "25px" }}
          >
            <img src={search} alt="search" />
            <input
              type="text"
              className="search-form-input"
              placeholder="Tìm kiếm"
            />
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tên nhà mạng</th>
                  <th>Giá trị thẻ</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {telecomList.map((item) => (
                  <tr key={item._id}>
                    <td className="fw-500 text-uppercase">{item.name}</td>
                    <td>{item.amounts?.map(amount => amount.toLocaleString("vi-VN")).join(", ")}</td>
                    <td>
                      <span className={`badges ${item.status ? 'status-success' : 'status-danger'}`}>
                        {item.status ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex align-items-center">
                        <Link to="#">
                          <img src={icon_edit} alt="edit" className="me-3" />
                        </Link>
                        <button type="button" onClick={() => handleDeleteTelecom(item._id)} style={{border: "none", background: "none", padding: 0}}>
                          <img src={icon_delete} alt="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {telecomList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Chưa có dữ liệu nhà mạng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="table-pagination-control">
              <span className="me-1">Show per page :</span>
              <select className="custom-select">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="table-pagination-nav">
              <ul className="pagination-list">
                <li className="pagination-item active">
                  <Link to="#" className="pagination-link">
                    <span>1</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="table-pagination-info">1 - {telecomList.length} of {telecomList.length} items</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardTopUp;
