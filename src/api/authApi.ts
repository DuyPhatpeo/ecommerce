import api from "../lib/axios";

/* ==========================
   INTERFACES
========================== */

// Địa chỉ của người dùng
export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt: string;
}

// Người dùng
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

/* ==========================
   API FUNCTIONS
========================== */

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

// Lấy profile
export const getUserProfile = async (userId: string) => {
  return await api.get<User>(`/users/${userId}`);
};

// Cập nhật thông tin user
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
) => {
  return await api.put<User>(`/users/${userId}`, data);
};

// Đổi mật khẩu
export const changeUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  // Lấy user hiện tại
  const res = await api.get(`/users/${userId}`);
  const user = res.data;

  // Kiểm tra mật khẩu cũ
  if (user.password !== oldPassword) {
    throw new Error("Current password is incorrect");
  }

  // Cập nhật mật khẩu mới
  return await api.put(`/users/${userId}`, { ...user, password: newPassword });
};
