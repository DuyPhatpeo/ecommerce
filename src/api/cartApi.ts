import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

/**
 * Kiểu dữ liệu item trong giỏ hàng
 */
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

/* ============================
   🛒 Lấy toàn bộ giỏ hàng
============================ */
export const getCart = async (): Promise<CartItem[]> => {
  const snapshot = await getDocs(collection(db, "cart"));
  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CartItem)
  );
};

/* ============================
   🛒 Lấy 1 item trong giỏ hàng theo id
============================ */
export const getCartItem = async (id: string): Promise<CartItem | null> => {
  const docRef = doc(db, "cart", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as CartItem)
    : null;
};

/* ============================
   🔄 Cập nhật số lượng của 1 item
============================ */
export const updateCartItem = async (id: string, quantity: number) => {
  const docRef = doc(db, "cart", id);
  await updateDoc(docRef, { quantity });
};

/* ============================
   ❌ Xóa 1 item khỏi giỏ hàng
============================ */
export const deleteCartItem = async (id: string) => {
  const docRef = doc(db, "cart", id);
  await deleteDoc(docRef);
};

/* ============================
   ➕ Thêm sản phẩm vào giỏ hàng
   (hoặc tăng số lượng nếu đã tồn tại)
============================ */
export const addToCart = async (productId: string, quantity = 1) => {
  const cart = await getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    // Nếu sản phẩm đã có → chỉ tăng số lượng
    const docRef = doc(db, "cart", existingItem.id);
    const newQty = existingItem.quantity + quantity;
    await updateDoc(docRef, { quantity: newQty });
    return { ...existingItem, quantity: newQty };
  } else {
    // Nếu chưa có → thêm mới
    const docRef = await addDoc(collection(db, "cart"), {
      productId,
      quantity,
    });
    await updateDoc(docRef, { id: docRef.id }); // lưu id cho đồng bộ
    return { id: docRef.id, productId, quantity };
  }
};

/* ============================
   🧹 Xóa toàn bộ giỏ hàng
============================ */
export const clearCart = async () => {
  const cart = await getCart();
  const deletePromises = cart.map((item) =>
    deleteDoc(doc(db, "cart", item.id))
  );
  await Promise.all(deletePromises);
  return [];
};
