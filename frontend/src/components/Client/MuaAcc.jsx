import "../../assets/css/Client/muaacc.css";

const MuaAccount = () => {
  return (
    <>
      <ul className="breadcrumb-list">
        <li className="breadcrumb-item">
          <a href="/" className="breadcrumb-link">
            Trang chủ
          </a>
        </li>
        <li className="breadcrumb-item">
          <a href="/mua-acc" className="breadcrumb-link">
            Mua Account
          </a>
        </li>
      </ul>
      <section className="account-section">
        <div className="account-header">
          <h2 className="text-[20px] font-bold leading-[28px]">
            Danh sách tất cả các Acc Game
          </h2>
        </div>
        <hr />
        <div className="py-4 text-[15px] font-bold leading-[24px]">
          Chọn game muốn mua account
        </div>
        <div className="account-list">
          <div className="account-item">
            <div className="card card-hover">
              <a href="#" className="p-4 card-body">
                <div className="card-image">
                  <img
                    src="https://static2.mingame89.store/19426957-cdnimaget1/upload/fastcdn/acc-category-shopt1com/82460/images/ACC_FF_T%E1%BB%B0_CH%E1%BB%8CN_%5B41AF991%5D%5B1%5D.gif"
                    alt="Ảnh game"
                  />
                </div>
                <div className="account-info">
                  <div className="account-name text-limit">Nick Free Fire tự chọn</div>
                  <div className="text-[var(--text-link)] text-[13px] font-normal leading-[20px]">Số tài khoản: 1000</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MuaAccount;
