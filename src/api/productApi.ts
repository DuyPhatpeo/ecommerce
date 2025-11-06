// src/api/productApi.ts
import { db } from "../lib/firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  QueryConstraint,
} from "firebase/firestore";

/* =====================
   TYPES
===================== */
export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  color?: string;
  size?: string | string[];
  description?: string;
  images?: string[];
  [key: string]: any;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}

/* =====================
   LẤY DANH SÁCH SẢN PHẨM
===================== */
export const getProducts = async (
  params: ProductFilter = {}
): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    const filters: QueryConstraint[] = [];

    // Thêm điều kiện lọc Firestore
    if (params.category) filters.push(where("category", "==", params.category));
    if (params.brand) filters.push(where("brand", "==", params.brand));
    if (params.color) filters.push(where("color", "==", params.color));
    if (params.size) filters.push(where("size", "==", params.size));
    if (params.minPrice !== undefined)
      filters.push(where("price", ">=", params.minPrice));
    if (params.maxPrice !== undefined)
      filters.push(where("price", "<=", params.maxPrice));

    const q = filters.length > 0 ? query(productsRef, ...filters) : productsRef;
    const snapshot = await getDocs(q);

    let products: Product[] = snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Product)
    );

    // Nếu có search, lọc thêm ở client
    if (params.search) {
      const keyword = params.search.toLowerCase();
      products = products.filter((p) =>
        (p.name || "").toLowerCase().includes(keyword)
      );
    }

    return products;
  } catch (error) {
    console.error("🔥 Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};

/* =====================
   LẤY CHI TIẾT SẢN PHẨM
===================== */
export const getProductById = async (id: string): Promise<Product> => {
  const q = query(collection(db, "products"), where("id", "==", id));
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error("Sản phẩm không tồn tại");
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Product;
};
