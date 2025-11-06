// src/api/orderApi.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

/* ==========================
   INTERFACES
========================== */
export interface CustomerInfo {
  id: string;
  fullName?: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  note?: string;
  paymentMethod?: string;
}

export interface OrderItem {
  productId: string;
  title?: string;
  price: number;
  quantity: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  status?: string;
}

export interface Order {
  id?: string; // custom order ID (ví dụ "1a30")
  customer: CustomerInfo;
  items: OrderItem[];
  createdAt: string; // ISO string
}

/* ==========================
   FIREBASE ORDER API
========================== */

// 🔹 Create a new order
export const createOrder = async (orderData: Order) => {
  try {
    const newOrder = {
      ...orderData,
      createdAt: new Date().toISOString(),
    };

    // ✅ Tạo doc mới trong Firestore
    const docRef = await addDoc(collection(db, "orders"), newOrder);

    // ✅ Nếu bạn muốn có cả docId trong dữ liệu Firestore
    // có thể update thêm sau khi tạo
    // await setDoc(docRef, { ...newOrder, docId: docRef.id });

    return { id: docRef.id, ...newOrder };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

// 🔹 Get all orders (latest first)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;

      return { id: docSnap.id, ...data, createdAt } as Order;
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

// 🔹 Get order details by custom field "id"
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    // ✅ Tìm theo field `id` trong dữ liệu
    const q = query(collection(db, "orders"), where("id", "==", orderId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Order not found");
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;

    return { id: docSnap.id, ...data, createdAt } as Order;
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    throw new Error("Failed to fetch order details");
  }
};
