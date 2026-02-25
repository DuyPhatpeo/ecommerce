import { create } from "zustand";
import { toast } from "react-toastify";
import { getCartItem, deleteCartItem } from "../api/cartApi";
import { getProductById } from "../api/productApi";
import { createOrder } from "../api/orderApi";
import { useCartStore } from "./cartStore";

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
  cartItemId?: string;
}

export interface CustomerInfo {
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "cod" | "banking" | "momo";
}

interface CheckoutState {
  products: (Product & { quantity: number })[];
  loading: boolean;
  placingOrder: boolean;
  customerInfo: CustomerInfo | null;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;

  setCustomerInfo: (info: CustomerInfo | null) => void;
  setProducts: (products: (Product & { quantity: number })[]) => void;

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

  goToConfirmPayment: (navigate: (path: string, options?: any) => void) => void;
  handlePlaceOrder: (
    navigate: (path: string, options?: any) => void,
  ) => Promise<void>;
  reset: () => void;
}

const LOCAL_STORAGE_KEY = "checkoutData";

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

  setCustomerInfo: (info) => {
    set({ customerInfo: info });
    const current = get();
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        customerInfo: info,
        products: current.products,
        subtotal: current.subtotal,
        tax: current.tax,
        shipping: current.shipping,
        total: current.total,
      }),
    );
  },

  setProducts: (products) => {
    set({ products });
    const current = get();
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        customerInfo: current.customerInfo,
        products,
        subtotal: current.subtotal,
        tax: current.tax,
        shipping: current.shipping,
        total: current.total,
      }),
    );
  },

  fetchProducts: async (params) => {
    const {
      selectedItems,
      productId,
      quantity,
      subtotal: providedSubtotal,
      tax: providedTax = 0,
      shipping: providedShipping = 0,
      total: providedTotal,
      navigate,
    } = params;

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

      if (selectedItems?.length) {
        const results = await Promise.all(
          selectedItems.map(async (item) => {
            const cartRes = await getCartItem(userId, item.id);
            if (!cartRes) return null;
            const productRes = await getProductById(cartRes.productId);
            if (!productRes) return null;
            return {
              ...productRes,
              cartItemId: cartRes.id,
              price: productRes.salePrice || productRes.regularPrice || 0,
              quantity: item.quantity,
            };
          }),
        );
        items = results.filter(Boolean) as any;
      } else if (productId && quantity) {
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

      // Lưu vào localStorage
      const current = get();
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          customerInfo: current.customerInfo,
          products: items,
          subtotal: calculatedSubtotal,
          tax: providedTax,
          shipping: providedShipping,
          total: calculatedTotal,
        }),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product data!");
    } finally {
      set({ loading: false });
    }
  },

  goToConfirmPayment: (navigate) => {
    const { customerInfo } = get();
    if (!customerInfo) {
      toast.error("Please enter shipping information!");
      return;
    }
    navigate("/confirm-payment");
  },

  handlePlaceOrder: async (navigate) => {
    const { customerInfo, products, subtotal, tax, shipping, total } = get();

    if (!customerInfo) {
      toast.error("Please enter shipping information!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User information not found. Please login again!");
      navigate("/login");
      return;
    }

    set({ placingOrder: true });
    const toastId = toast.loading("Processing your order...");

    try {
      const updatedProducts = await Promise.all(
        products.map(async (p) => {
          const res = await getProductById(p.id);
          const current = res.data || res;
          return {
            ...p,
            price: current.salePrice || current.regularPrice || 0,
            regularPrice: current.regularPrice,
            salePrice: current.salePrice,
          };
        }),
      );

      const statusMap = { cod: "pending", banking: "banking", momo: "paid" };
      const orderData = {
        customer: {
          id: userId,
          recipientName: customerInfo.recipientName,
          phone: customerInfo.phone,
          address: customerInfo.address,
          note: customerInfo.note,
          paymentMethod: customerInfo.paymentMethod,
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
        status: statusMap[customerInfo.paymentMethod],
        createdAt: new Date().toISOString(),
      };

      const res = await createOrder(orderData);

      // Xoá các sản phẩm đã mua khỏi giỏ hàng
      await Promise.all(
        products
          .filter((p) => p.cartItemId)
          .map((p) => deleteCartItem(userId!, p.cartItemId!)),
      ).catch((err) => console.error("Failed to delete cart items", err));

      useCartStore.getState().fetchCart();

      toast.update(toastId, {
        render: "Order placed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      set(initialState);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      navigate("/order-success", { state: { order: res }, replace: true });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "Order failed, please try again!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      set({ placingOrder: false });
    }
  },

  reset: () => {
    set(initialState);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
}));
