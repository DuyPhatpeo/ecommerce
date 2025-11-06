import {
  collection,
  getDocs,
  doc,
  query,
  where,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

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
   FIREBASE API FUNCTIONS
========================== */

// 🔹 Lấy toàn bộ user
export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
};

// 🔹 Lấy user theo email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
};

// 🔹 Đăng ký user mới
export const registerUser = async (data: User): Promise<User> => {
  const userId = uuidv4(); // ✅ sinh UUID cho cả user.id và doc.id
  const newUser: User = {
    ...data,
    id: userId,
    createdAt: new Date().toISOString(),
  };

  // Lưu với doc ID = userId luôn (đồng bộ)
  await setDoc(doc(db, "users", userId), newUser);

  return newUser;
};

// 🔹 Lấy thông tin user theo user.id (field trong document)
export const getUserProfile = async (userId: string): Promise<User> => {
  // 🔍 Tìm document có field "id" = userId (thay vì doc.id)
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");

  const docData = snapshot.docs[0];
  return { id: docData.id, ...docData.data() } as User;
};

// 🔹 Cập nhật thông tin user — merge dữ liệu
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  // 🔍 Lấy document theo field "id"
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");

  const userRef = doc(db, "users", snapshot.docs[0].id);
  const currentData = snapshot.docs[0].data();
  const updatedUser = { ...currentData, ...data };
  await updateDoc(userRef, updatedUser);
};

// 🔹 Đổi mật khẩu — giữ nguyên dữ liệu khác
export const changeUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  // 🔍 Tìm document theo field "id"
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");

  const userRef = doc(db, "users", snapshot.docs[0].id);
  const user = snapshot.docs[0].data() as User;

  if (user.password !== oldPassword) {
    throw new Error("Mật khẩu hiện tại không chính xác");
  }

  await updateDoc(userRef, { password: newPassword });
};
