// 📦 src/api/userApi.js
import api from "../lib/axios";

// 🧾 Lấy danh sách user (để kiểm tra email trùng)
export const getUsers = async () => {
  return await api.get("/users");
};

// 🔍 Lấy user theo email (có thể dùng cho login / kiểm tra tồn tại)
export const getUserByEmail = async (email) => {
  return await api.get(`/users?email=${encodeURIComponent(email)}`);
};

// 🆕 Đăng ký user mới (lưu vào db.json)
export const registerUser = async (data) => {
  return await api.post("/users", data);
};
