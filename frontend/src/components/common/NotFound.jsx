import { useUIStore } from "../../store/useUIStore";
import not_found from "../../assets/svg/not-found.svg";

const NotFound = ({ className }) => {
  const notFoundText = useUIStore((s) => s.notFoundText);
  return (
    <div className={`not-found ${className}`}>
      <img src={not_found} alt="Not Found" />
      <span className="fz-14 fw-500 text-link">{notFoundText}</span>
    </div>
  );
};

export default NotFound;
