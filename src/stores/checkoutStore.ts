import { create } from "zustand";
import { toast } from "react-toastify";

import { getCartItem } from "../api/cartApi";
import { getProductById } from "../api/productApi";
import { createOrder } from "../api/orderApi";

/* =====================
   TYPES
===================== */
export interface Product {
  id: string;
  title: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  category?: string;
  brand?: string;
  color?: string;
  size?: string | string[];
  description?: string;
  img?: string;
  images?: string[];
}

export interface CustomerInfo {
  recipientName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "cod" | "banking" | "momo";
}

interface CheckoutState {
  // State
  products: (Product & { quantity: number })[];
  loading: boolean;
  placingOrder: boolean;
  customerInfo: CustomerInfo | null;

  // Checkout data
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;

  // Actions
  setCustomerInfo: (info: CustomerInfo | null) => void;
  fetchProducts: (params: {
    selectedItems?: { id: string; quantity: number }[];
    productId?: string;
    quantity?: number;
    subtotal?: number;
    tax?: number;
    shipping?: number;
    total?: number;
    navigate: (path: string, options?: any) => void;
  }) => Promise<void>;
  handlePlaceOrder: (
    navigate: (path: string, options?: any) => void
  ) => Promise<void>;
  reset: () => void;
}

const initialState = {
  products: [],
  loading: false,
  placingOrder: false,
  customerInfo: null,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  setCustomerInfo: (info) => set({ customerInfo: info }),

  fetchProducts: async ({
    selectedItems,
    productId,
    quantity,
    subtotal: providedSubtotal,
    tax: providedTax = 0,
    shipping: providedShipping = 0,
    total: providedTotal,
    navigate,
  }) => {
    set({ loading: true });

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to proceed with checkout!");
      navigate("/login");
      set({ loading: false });
      return;
    }

    try {
      let items: (Product & { quantity: number })[] = [];

      // Fetch from cart items
      if (selectedItems?.length) {
        const results = await Promise.all(
          selectedItems.map(async (item) => {
            const cartRes = await getCartItem(userId, item.id);
            if (!cartRes) return null;

            const productRes = await getProductById(cartRes.productId);
            if (!productRes) return null;

            return {
              ...productRes,
              price: productRes.salePrice || productRes.regularPrice || 0,
              quantity: item.quantity,
            };
          })
        );

        items = results.filter(
          (p): p is Product & { quantity: number } => p !== null
        );
      }
      // Fetch single product (Buy Now)
      else if (productId && quantity) {
        const productRes = await getProductById(productId);
        if (productRes) {
          items.push({
            ...productRes,
            price: productRes.salePrice || productRes.regularPrice || 0,
            quantity,
          });
        }
      }

      if (!items.length) {
        toast.error("No products available for checkout!");
        navigate("/", { replace: true });
        return;
      }

      // Calculate totals
      const calculatedSubtotal =
        providedSubtotal ??
        items.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);

      const calculatedTotal =
        providedTotal ?? calculatedSubtotal + providedTax + providedShipping;

      set({
        products: items,
        subtotal: calculatedSubtotal,
        tax: providedTax,
        shipping: providedShipping,
        total: calculatedTotal,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product data!");
    } finally {
      set({ loading: false });
    }
  },

  handlePlaceOrder: async (navigate) => {
    const { customerInfo, products, subtotal, tax, shipping, total } = get();

    if (!customerInfo) {
      toast.error("Please enter shipping information!");
      return;
    }

    const { recipientName, phone, address, paymentMethod, note } = customerInfo;
    if (!recipientName || !phone || !address) {
      toast.error("Please fill in all required information!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User information not found. Please login again!");
      navigate("/login");
      return;
    }

    set({ placingOrder: true });

    const toastId = toast.loading("Processing your order...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    });

    try {
      // Refresh product prices
      const updatedProducts = await Promise.all(
        products.map(async (p) => {
          const res = await getProductById(p.id);
          const current = res?.data || res;
          return {
            ...p,
            price: current.salePrice || current.regularPrice || 0,
            regularPrice: current?.regularPrice,
            salePrice: current?.salePrice,
          };
        })
      );

      const statusMap: Record<string, string> = {
        cod: "pending",
        banking: "banking",
        momo: "paid",
      };
      const status = statusMap[paymentMethod] ?? "pending";

      const orderData = {
        customer: {
          id: userId,
          recipientName,
          phone,
          address,
          note,
          paymentMethod,
        },
        items: updatedProducts.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        subtotal,
        tax,
        shipping,
        total,
        status,
        createdAt: new Date().toISOString(),
      };

      const res = await createOrder(orderData);

      toast.update(toastId, {
        render: "Order placed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });

      localStorage.removeItem("checkoutItems");

      // Reset store
      set(initialState);

      navigate("/order-success", { state: { order: res }, replace: true });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "Failed to place order, please try again!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    } finally {
      set({ placingOrder: false });
    }
  },

  reset: () => set(initialState),
}));
