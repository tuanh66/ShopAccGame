import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { accountsService } from "../../service/accountsService";
import { FaRegCopy, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const ChiTietTaiKhoanDaMua = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await accountsService.readAccountBoughtDetail(id);
        setAccount(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết:", error);
        toast.error("Không thể lấy thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!");
  };

  if (loading) return <div className="text-center py-40">Đang tải...</div>;
  if (!account) return <div className="text-center py-40">Không tìm thấy dữ liệu</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="fz-20 fw-700 lh-28 text-title">Thông tin giao dịch</h1>
      </div>
      <div className="card-body px-16 py-16">
        <div className="card-gray py-12 px-16 mb-24">
          <div className="d-flex justify-content-between mb-12">
            <span className="text-link fz-13">ID</span>
            <span className="fw-700 fz-13 text-title">#UEU{account.accountsId}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-link fz-13">Game</span>
            <span className="fw-700 fz-13 text-title">{account.categoryName}</span>
          </div>
        </div>

        <div className="mb-24">
          <label className="fz-13 fw-500 mb-8 d-block text-title">Tài khoản</label>
          <div className="input-group-custom d-flex align-items-center justify-content-between">
            <span className="fz-15 fw-600">{account.username}</span>
            <FaRegCopy className="cursor-pointer text-link" onClick={() => handleCopy(account.username)} />
          </div>
        </div>

        <div className="mb-24">
          <label className="fz-13 fw-500 mb-8 d-block text-title">Mật khẩu</label>
          <div className="input-group-custom d-flex align-items-center justify-content-between">
            <span className="fz-15 fw-600">{showPassword ? account.password : "********"}</span>
            <div className="d-flex gap-16 align-items-center">
              {showPassword ? (
                <FaEyeSlash className="cursor-pointer text-link" onClick={() => setShowPassword(false)} />
              ) : (
                <FaEye className="cursor-pointer text-link" onClick={() => setShowPassword(true)} />
              )}
              <FaRegCopy className="cursor-pointer text-link" onClick={() => handleCopy(account.password)} />
            </div>
          </div>
        </div>

        <div className="card-gray py-12 px-16 mb-24">
          <div className="d-flex justify-content-between mb-12">
            <span className="text-link fz-13">Trị giá</span>
            <span className="fw-700 fz-13 text-title">{new Intl.NumberFormat("vi-VN").format(account.price_sale > 0 ? account.price_sale : account.price)}đ</span>
          </div>
          <div className="d-flex justify-content-between mb-12">
            <span className="text-link fz-13">Ngày giao dịch</span>
            <span className="fw-700 fz-13 text-title">{new Date(account.updatedAt).toLocaleString("vi-VN")}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-link fz-13">Trạng thái</span>
            <span className="text-green fw-700 fz-13">Thành công</span>
          </div>
        </div>

        <div className="row mb-24">
          {account.image?.map((img, index) => (
            <div key={index} className="col-4 mb-12">
              <img src={img} alt="nick" className="w-100 rounded border" />
            </div>
          ))}
        </div>

        <div className="attributes-list border-top pt-16">
          <div className="row">
            {account.attributes?.map((attr, index) => (
              <div key={index} className="col-6 mb-12 d-flex justify-content-between">
                <span className="text-link fz-13">{attr.label}</span>
                <span className="fw-600 fz-13 text-title">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 p-12 bg-light-blue rounded fz-13 text-center text-link">
          Để bảo mật bạn vui lòng thay đổi mật khẩu và tên đăng nhập của tài khoản đã mua!
        </div>
      </div>
    </div>
  );
};

export default ChiTietTaiKhoanDaMua;