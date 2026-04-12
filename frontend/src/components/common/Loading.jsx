import { useAuthStore } from "../../store/useAuthStore";
import { useUIStore } from "../../store/useUIStore";

const Loading = ({ isOverlay = true, loading: localLoading }) => {
  const authLoading = useAuthStore((s) => s.loading);
  const uiLoading = useUIStore((s) => s.loading);
  const isLoading = localLoading !== undefined ? localLoading : (authLoading || uiLoading);

  if (!isLoading) return null;

  const loadingRing = (
    <div className="fui-loading-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
  // Nếu là Overlay (mặc định) thì bọc thêm div container
  if (isOverlay) {
    return <div className="loading-container">{loadingRing}</div>;
  }
  // Ngược lại chỉ trả về vòng xoay (để bỏ vào nút bấm hoặc bảng biểu)
  return loadingRing;
};

export default Loading;
