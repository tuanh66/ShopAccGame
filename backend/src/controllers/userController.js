export const authMe = (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
