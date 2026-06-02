import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { settingService } from "../../service/settingService";

const Social = () => {
  const [socialData, setSocialData] = useState({
    social: {
      facebook: "",
      youtube: "",
      telegram: "",
      discord: "",
      tiktok: "",
      zalo: "",
    },
    time: "",
  });

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const res = await settingService.getSocial();
        if (res.data) {
          setSocialData({
            social: {
              facebook: res.data.social?.facebook || "",
              youtube: res.data.social?.youtube || "",
              telegram: res.data.social?.telegram || "",
              discord: res.data.social?.discord || "",
              tiktok: res.data.social?.tiktok || "",
              zalo: res.data.social?.zalo || "",
            },
            time: res.data.time || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu mạng xã hội:", error);
        toast.error("Không thể tải cài đặt mạng xã hội");
      }
    };
    fetchSocial();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "time") {
      setSocialData((prev) => ({
        ...prev,
        time: value,
      }));
    } else {
      setSocialData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingService.updateSocial(socialData);
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật mạng xã hội:", error);
      toast.error("Cập nhật thất bại");
    }
  };
  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>CÀI ĐẶT MẠNG XÃ HỘI</h4>
          <span>Quản lý liên kết mạng xã hội của website</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-social" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="facebook">
                  Facebook<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập link facebook"
                  name="facebook"
                  id="facebook"
                  value={socialData.social.facebook}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="youtube">
                  Youtube<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập link youtube"
                  name="youtube"
                  id="youtube"
                  value={socialData.social.youtube}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="telegram">
                  Telegram<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập link telegram"
                  name="telegram"
                  id="telegram"
                  value={socialData.social.telegram}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="discord">
                  Discord<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập link discord"
                  name="discord"
                  id="discord"
                  value={socialData.social.discord}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="tiktok">
                  Tiktok<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập link tiktok"
                  name="tiktok"
                  id="tiktok"
                  value={socialData.social.tiktok}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="zalo">
                  Zalo<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập số zalo"
                  name="zalo"
                  id="zalo"
                  value={socialData.social.zalo}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="time">
                  Giờ làm việc<span>*</span>
                </label>
                <input
                  type="text"
                  name="time"
                  id="time"
                  placeholder="Nhập giờ làm việc"
                  value={socialData.time}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary" type="submit">
                  Cập nhật
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Social;
