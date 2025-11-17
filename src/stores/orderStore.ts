import { create } from "zustand";
import { toast } from "react-toastify";

import { getOrderById, getOrdersByUser } from "../api/orderApi";
import { getProductById } from "../api/productApi";

interface Customer {
  id: string;
  recipientName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  note?: string;
  paymentMethod?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  status?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: number;
}

interface ProductDetail {
  id: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
}

interface OrderState {
  // State
  orders: Record<string, OrderDetail>;
  products: Record<string, ProductDetail[]>;
  userOrders: Record<string, Order[]>;
  loading: Record<string, boolean>;

  // Actions
  fetchOrderDetail: (orderId: string) => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: {},
  products: {},
  userOrders: {},
  loading: {},

  /* ==========================
     FETCH ORDER DETAIL
  ========================== */
  fetchOrderDetail: async (orderId: string) => {
    if (!orderId) return;

    set((state) => ({
      loading: { ...state.loading, [orderId]: true },
    }));

    try {
      const orderData = await getOrderById(orderId);

      if (!orderData) {
        toast.error("Order not found!");
        set((state) => ({
          loading: { ...state.loading, [orderId]: false },
        }));
        return;
      }

      set((state) => ({
        orders: { ...state.orders, [orderId]: orderData },
      }));

      const productDetails = await Promise.all(
        (orderData.items || []).map(async (item: OrderItem) => {
          try {
            const product = await getProductById(item.productId);
            return {
              id: item.productId,
              title: product.title,
              image:
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.png",
              price: item.price,
              quantity: item.quantity,
            };
          } catch {
            return {
              id: item.productId,
              title: "Product not found",
              image: "/placeholder.png",
              price: item.price,
              quantity: item.quantity,
            };
          }
        })
      );

      set((state) => ({
        products: { ...state.products, [orderId]: productDetails },
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order details!");
    } finally {
      set((state) => ({
        loading: { ...state.loading, [orderId]: false },
      }));
    }
  },

  /* ==========================
     FETCH USER ORDERS
  ========================== */
  fetchUserOrders: async (userId: string) => {
    if (!userId) return;

    set((state) => ({
      loading: { ...state.loading, [`user_${userId}`]: true },
    }));

    try {
      const data = await getOrdersByUser(userId);

      const formattedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status || "pending",
        total: order.total || 0,
        items: order.items?.length || 0,
      }));

      set((state) => ({
        userOrders: { ...state.userOrders, [userId]: formattedOrders },
      }));
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      toast.error("Failed to load orders!");
    } finally {
      set((state) => ({
        loading: { ...state.loading, [`user_${userId}`]: false },
      }));
    }
  },
}));
