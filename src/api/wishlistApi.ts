// src/api/wishlistApi.ts
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

const WISHLIST_COLLECTION = "wishlist";

/* ==========================
   ADD TO WISHLIST
========================== */
export const addToWishlist = async (userId: string, productId: string) => {
  if (!userId) throw new Error("User not logged in");

  const wishlistId = uuidv4(); // ✅ Tạo ID riêng

  const ref = doc(db, WISHLIST_COLLECTION, wishlistId);

  await setDoc(ref, {
    id: wishlistId,
    userId,
    productId,
    createdAt: serverTimestamp(),
  });

  return true;
};

/* ==========================
   REMOVE FROM WISHLIST
========================== */
export const removeFromWishlist = async (userId: string, productId: string) => {
  if (!userId) throw new Error("User not logged in");

  const q = query(
    collection(db, WISHLIST_COLLECTION),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );

  const snap = await getDocs(q);

  snap.forEach((docSnap) => {
    deleteDoc(doc(db, WISHLIST_COLLECTION, docSnap.data().id)); // ✅ Xóa đúng document bằng id riêng
  });

  return true;
};

/* ==========================
   GET USER WISHLIST
========================== */
export const getWishlist = async (userId: string) => {
  if (!userId) return [];

  const q = query(
    collection(db, WISHLIST_COLLECTION),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: data.id, // ✅ chính là uuid
      userId: data.userId,
      productId: data.productId,
      createdAt: data.createdAt?.toDate().toISOString() ?? null,
    };
  });
};

/* ==========================
   CHECK ITEM IN WISHLIST
========================== */
export const isInWishlist = async (userId: string, productId: string) => {
  if (!userId) return false;

  const q = query(
    collection(db, WISHLIST_COLLECTION),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );

  const snap = await getDocs(q);
  return !snap.empty;
};
