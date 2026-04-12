import { Link } from "react-router-dom";
import image_404 from "../assets/img/image-404.png";
import text_404 from "../assets/img/404.png";

const NotFound = () => {
  return (
    <div className="default-page-404">
      <div className="row page-404">
        <div className="image-default p-0">
          <img src={image_404} alt="404" />
        </div>
        <div className="col-6 image-404">
          <img src={text_404} alt="404" />
        </div>
        <div className="col-6 text-404 pl-0">
          <p>PAGE</p>
          <span>NOT FOUND</span>
        </div>
        <div className="pt-40 px-24 description-404">
          <p>
            Rất tiếc! Trang bạn truy cập đã không được tìm thấy, Xin lỗi bạn vì
            điều này thật bất tiện, vui lòng ghé lại sau nha
          </p>
          <Link to="/">
            <button className="btn primary mb-40">Về trang chủ</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
