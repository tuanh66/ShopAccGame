export const ROLES = {
  USER: 0,
  ADMIN: 1,
  COLLABORATOR: 2,
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // protectedRoute phải chạy trước
      if (!req.user) {
        return res.status(401).json({
          message: "Chưa xác thực người dùng",
        });
      }

      // kiểm tra role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập",
        });
      }

      next();
    } catch (error) {
      console.error("Lỗi authorize:", error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  };
};