// src/api/orderApi.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

/* ==========================
   INTERFACES
========================== */
export interface CustomerInfo {
  id: string; // UID từ Firebase Auth
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  title?: string;
  price: number;
  quantity: number;
}

export interface Order {
  firestoreId?: string;
  id: string; // mã đơn hàng (UUID)
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string; // pending | processing | completed | cancelled
}

/* ==========================
   CREATE ORDER
========================== */
export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt">
) => {
  try {
    const orderId = uuidv4();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);
    console.log("✅ Order created successfully:", orderId);

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
    console.error("❌ Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

/* ==========================
   GET ORDERS BY USER ID
========================== */
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    if (!userId) throw new Error("Missing userId for query");

    const q = query(
      collection(db, "orders"),
      where("customer.id", "==", userId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`ℹ️ No orders found for user ${userId}`);
      return [];
    }

    const orders = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;

      return { firestoreId: docSnap.id, ...data, createdAt } as Order;
    });

    // ✅ Sắp xếp theo thời gian giảm dần
    return orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
};

/* ==========================
   GET ORDER BY ID
========================== */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    if (!orderId) throw new Error("Missing orderId");

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
    console.error("❌ Error fetching order by id:", error);
    throw new Error("Failed to fetch order details");
  }
};
