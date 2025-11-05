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

// Lấy thông tin user theo ID
export const getUserProfile = async (userId: string) => {
  return await api.get<User>(`/users/${userId}`);
};

/* --------------------------------------------------
   ✅ Cập nhật user — chỉ cập nhật phần thay đổi
   → lấy dữ liệu hiện tại → merge → PUT
-------------------------------------------------- */
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
) => {
  // Lấy thông tin user hiện tại
  const res = await api.get<User>(`/users/${userId}`);
  const currentUser = res.data;

  // Merge để giữ các giá trị cũ
  const updatedUser: User = {
    ...currentUser,
    ...data,
  };

  // Cập nhật
  return await api.put<User>(`/users/${userId}`, updatedUser);
};

/* --------------------------------------------------
   ✅ Đổi mật khẩu — giữ nguyên dữ liệu khác
-------------------------------------------------- */
export const changeUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const res = await api.get<User>(`/users/${userId}`);
  const user = res.data;

  if (user.password !== oldPassword) {
    throw new Error("Mật khẩu hiện tại không chính xác");
  }

  const updatedUser: User = {
    ...user,
    password: newPassword,
  };

  return await api.put<User>(`/users/${userId}`, updatedUser);
};
