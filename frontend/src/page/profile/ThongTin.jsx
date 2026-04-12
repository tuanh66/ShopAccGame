import { useAuthStore } from "../../store/useAuthStore";

const ThongTin = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="fz-20 fw-700 lh-28 text-title">Thông tin tài khoản</h1>
      </div>
      <div className="card-body px-16 py-16">
        <div className="history-detail-attr d-flex justify-content-between align-items-center mb-8">
          <p className="fz-13 fw-400 text-link">ID của bạn</p>
          <div className="fz-13 fw-400">{user?.id}</div>
        </div>
        <div className="history-detail-attr d-flex justify-content-between align-items-center mb-8">
          <p className="fz-13 fw-400 text-link">Tên tài khoản</p>
          <div className="fz-13 fw-400">{user?.username}</div>
        </div>
        <div className="history-detail-attr d-flex justify-content-between align-items-center mb-12">
          <p className="fz-13 fw-400 text-link">Số dư tài khoản</p>
          <div className="fz-13 fw-400 text-primary">
            {new Intl.NumberFormat("vi-VN").format(user?.balance)}đ
          </div>
        </div>
        <form className="w-100 d-flex">
          <input type="text" placeholder="Nhập mã giới thiệu" />
          <button type="submit" className="btn primary ml-16">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThongTin;
