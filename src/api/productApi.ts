import { db } from "../lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  QueryConstraint,
} from "firebase/firestore";

export interface Product {
  id: string;
  title: string;
  price: number;
  category?: string;
  brand?: string;
  color?: string;
  size?: string | string[];
  description?: string;
  salePrice?: number;
  regularPrice?: number;
  img?: string;
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

export const getProducts = async (
  params: ProductFilter = {}
): Promise<Product[]> => {
  const productsRef = collection(db, "products");
  const filters: QueryConstraint[] = [];

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

  if (params.search) {
    const keyword = params.search.toLowerCase();
    products = products.filter((p) =>
      (p.title || "").toLowerCase().includes(keyword)
    );
  }

  return products;
};

export const getProductById = async (id: string): Promise<Product> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }

  const q = query(collection(db, "products"), where("id", "==", id));
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error("Sản phẩm không tồn tại");
  const firstDoc = snapshot.docs[0];
  return { id: firstDoc.id, ...firstDoc.data() } as Product;
};
