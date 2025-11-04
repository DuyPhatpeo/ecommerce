import api from "../lib/axios";

// ---------------------------
// 🧩 Kiểu dữ liệu
// ---------------------------
export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  postalCode?: string;
  isDefault?: boolean;
  createdAt?: string;
}

export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: string;
  token?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
  addresses?: Address[];
}

// ---------------------------
// 📦 API Methods
// ---------------------------

// Lấy toàn bộ user
export const getUsers = async () => {
  return await api.get<User[]>("/users");
};

// Lấy user theo email (để login)
export const getUserByEmail = async (email: string) => {
  return await api.get<User[]>(`/users?email=${encodeURIComponent(email)}`);
};

// Đăng ký user mới
export const registerUser = async (data: User) => {
  return await api.post<User>("/users", data);
};

// ---------------------------
// 👤 Lấy profile người dùng
// ---------------------------
export const getUserProfile = async (userId: string) => {
  return await api.get<User>(`/users/${userId}`);
};

// ---------------------------
// 🏠 Lấy danh sách địa chỉ
// ---------------------------
export const getUserAddresses = async (userId: string) => {
  return await api.get<Address[]>(`/users/${userId}/addresses`);
};
