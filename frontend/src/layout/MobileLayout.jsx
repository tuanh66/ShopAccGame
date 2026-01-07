import { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import da_xem from "../assets/img/da_xem.png";

const MobileLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("hide-header-footer");

    return () => {
      document.body.classList.remove("hide-header-footer");
    };
  }, []);

  return (
    <>
      <div className="header-mobile">
        <button className="header-mobile-back" onClick={() => navigate(-1)} />
        <span className="header-mobile-title">Shop Account</span>
        <Link to="/da-xem">
          <img className="header-mobile-view" src={da_xem} alt="icon" />
        </Link>
      </div>
      <Outlet />
    </>
  );
};

export default MobileLayout;
