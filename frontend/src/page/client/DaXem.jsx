import { useUIStore } from "../../store/useUIStore";
import NotFound from "../../components/common/NotFound";
const DaXem = () => {
  const setNotFoundText = useUIStore((s) => s.setNotFoundText);
  setNotFoundText("Không có sản phẩm nào được xem");
  return (
    <>
      <div className="fz-20 fw-500 mt-16">Sản phẩm bạn đã xem</div>
      <div className="mt-16">
        <NotFound />
        {/* <div className="account-item"></div> */}
      </div>
    </>
  );
};

export default DaXem;
