// src/api/orderApi.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

/* ==========================
   INTERFACES
========================== */
export interface CustomerInfo {
  id: string; // ✅ firebase user uid
  recipientName?: string;
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
  firestoreId?: string;
  id: string; // custom order code
  customer: CustomerInfo;
  items: OrderItem[];
  createdAt: string;
}

/* ==========================
   CREATE ORDER
========================== */
export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt">
) => {
  try {
    const orderId = uuidv4(); // ✅ mã đơn hàng
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);

    return { firestoreId: docRef.id, ...newOrder };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

/* ==========================
   GET ALL ORDERS
========================== */
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

      return { firestoreId: docSnap.id, ...data, createdAt } as Order;
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

/* ==========================
   GET ORDERS BY USER ID (🔥 QUAN TRỌNG)
========================== */
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("customer.id", "==", userId), // ✅ lọc theo tài khoản đăng nhập
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;

      return { firestoreId: docSnap.id, ...data, createdAt } as Order;
    });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
};

/* ==========================
   GET ORDER DETAILS BY ORDER ID
========================== */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const q = query(collection(db, "orders"), where("id", "==", orderId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Order not found");

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;

    return { firestoreId: docSnap.id, ...data, createdAt } as Order;
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    throw new Error("Failed to fetch order details");
  }
};
