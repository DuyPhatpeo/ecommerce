// src/api/cartApi.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

/* ============================
   🛒 Kiểu dữ liệu item trong giỏ hàng
============================ */
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
}

/* ============================
   🛒 Lấy toàn bộ giỏ hàng của user
============================ */
export const getCart = async (userId: string): Promise<CartItem[]> => {
  if (!userId) return [];

  const q = query(collection(db, "cart"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CartItem)
  );
};

/* ============================
   🛒 Lấy 1 item trong giỏ hàng theo id (kiểm tra userId)
============================ */
export const getCartItem = async (
  userId: string,
  id: string
): Promise<CartItem | null> => {
  const docRef = doc(db, "cart", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  const data = docSnap.data() as CartItem;

  if (data.userId !== userId) return null; // tránh lấy item của user khác
  return { id: docSnap.id, ...data };
};

/* ============================
   ➕ Thêm sản phẩm vào giỏ hàng
   (hoặc tăng số lượng nếu đã tồn tại)
============================ */
export const addToCart = async (
  userId: string,
  productId: string,
  quantity = 1
) => {
  if (!userId) throw new Error("User not logged in");

  const cart = await getCart(userId);
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    const docRef = doc(db, "cart", existingItem.id);
    const newQty = existingItem.quantity + quantity;
    await updateDoc(docRef, { quantity: newQty });
    return { ...existingItem, quantity: newQty };
  } else {
    const docRef = await addDoc(collection(db, "cart"), {
      userId,
      productId,
      quantity,
    });
    await updateDoc(docRef, { id: docRef.id });
    return { id: docRef.id, userId, productId, quantity };
  }
};

/* ============================
   🔄 Cập nhật số lượng của 1 item
============================ */
export const updateCartItem = async (
  userId: string,
  id: string,
  quantity: number
) => {
  const item = await getCartItem(userId, id);
  if (!item) throw new Error("Item not found or unauthorized");

  const docRef = doc(db, "cart", id);
  await updateDoc(docRef, { quantity });
  return { ...item, quantity };
};

/* ============================
   ❌ Xóa 1 item khỏi giỏ hàng
============================ */
export const deleteCartItem = async (userId: string, id: string) => {
  const item = await getCartItem(userId, id);
  if (!item) throw new Error("Item not found or unauthorized");

  const docRef = doc(db, "cart", id);
  await deleteDoc(docRef);
  return true;
};

/* ============================
   🧹 Xóa toàn bộ giỏ hàng của user
============================ */
export const clearCart = async (userId: string) => {
  const cart = await getCart(userId);
  const deletePromises = cart.map((item) =>
    deleteDoc(doc(db, "cart", item.id))
  );
  await Promise.all(deletePromises);
  return [];
};
