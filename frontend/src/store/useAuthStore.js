import { create } from "zustand";
import toast from "react-hot-toast";
import { authService } from "../service/authService";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  showLoginModal: false,
  setShowLoginModal: (value) => set({ showLoginModal: value }),

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
  signUp: async (username, password, role, email) => {
    try {
      set({ loading: true });

      await authService.signUp(username, password, role, email);
      toast.success(
        "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công");
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);
      localStorage.setItem("logged_in", "true");
      await get().fetchMe();

      toast.success("Đăng nhập thành công 🎉");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      get().clearState();
      localStorage.removeItem("logged_in");
      await authService.signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
    } finally {
      set({ loading: false });
    }
  },
  refresh: async () => {
    try {
      const accessToken = await authService.refresh();

      set({ accessToken });

      const { user, fetchMe } = get();

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      // toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      get().clearState();
    }
  },
}));
