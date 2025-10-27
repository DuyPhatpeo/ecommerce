import api from "../lib/axios";

// Định nghĩa kiểu dữ liệu User
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

// 🧾 Lấy danh sách user (để kiểm tra email trùng)
export const getUsers = async () => {
  return await api.get<User[]>("/users");
};

// 🔍 Lấy user theo email (có thể dùng cho login / kiểm tra tồn tại)
export const getUserByEmail = async (email: string) => {
  return await api.get<User[]>(`/users?email=${encodeURIComponent(email)}`);
};

// 🆕 Đăng ký user mới (lưu vào db.json)
export const registerUser = async (data: User) => {
  return await api.post<User>("/users", data);
};
