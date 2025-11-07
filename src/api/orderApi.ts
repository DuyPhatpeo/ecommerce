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

export interface CustomerInfo {
  id: string;
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
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
}

export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt">
) => {
  const orderId = uuidv4();
  const newOrder: Order = {
    ...orderData,
    id: orderId,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "orders"), newOrder);
  return { firestoreId: docRef.id, ...newOrder };
};

export const getAllOrders = async (): Promise<Order[]> => {
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
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  if (!userId) throw new Error("Missing userId for query");

  const q = query(collection(db, "orders"), where("customer.id", "==", userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  const orders = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;

    return { firestoreId: docSnap.id, ...data, createdAt } as Order;
  });

  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getOrderById = async (orderId: string): Promise<Order> => {
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
};
