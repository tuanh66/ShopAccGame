/**
 * Định dạng ngày tháng: DD/MM/YYYY - HH:mm
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

/**
 * Định dạng tiền tệ: 100.000đ
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount || 0) + "đ";
};
