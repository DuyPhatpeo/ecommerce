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

export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: string;
  addresses?: Address[];
}
// FIREBASE API FUNCTIONS

//  Lấy toàn bộ user
export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
};

//  Lấy user theo email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
};

//  Đăng ký user mới
export const registerUser = async (data: User): Promise<User> => {
  const userId = uuidv4();
  const newUser: User = {
    ...data,
    id: userId,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", userId), newUser);
  return newUser;
};

//  Lấy thông tin user theo field id
export const getUserProfile = async (userId: string): Promise<User> => {
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");

  const docData = snapshot.docs[0];
  return { id: docData.id, ...docData.data() } as User;
};

//  Cập nhật profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");

  const userRef = doc(db, "users", snapshot.docs[0].id);
  await updateDoc(userRef, data);
};

//  Đổi mật khẩu
export const changeUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");

  const userRef = doc(db, "users", snapshot.docs[0].id);
  const user = snapshot.docs[0].data() as User;

  if (user.password !== oldPassword)
    throw new Error("Current password is incorrect");

  await updateDoc(userRef, { password: newPassword });
};
