import { create } from "zustand";
import { toast } from "react-toastify";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  addToCart,
} from "../api/cartApi";

/* =====================
   TYPES
===================== */
export interface CartProductItem {
  id: string;
  userId?: string;
  productId?: string;
  title: string;
  price: number;
  stock?: number;
  quantity: number;
  images?: string[];
  product?: any;
  [key: string]: any;
}

interface CartState {
  userId: string | null;
  cartItems: CartProductItem[];
  selectedItems: string[];
  loading: boolean;
  updating: string | null;
  clearing: boolean;

  cartCount: number;
  updateCartCount: () => void;

  setUserId: (userId: string | null) => void;
  fetchCart: () => Promise<void>;
  updateQuantity: (id: string, change: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  removeAll: () => Promise<void>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  addItemToCart: (params: {
    id: string;
    title: string;
    stock?: number;
    quantity: number;
    price: number;
    images?: string[];
    navigate?: (path: string) => void;
  }) => Promise<void>;
  reset: () => void;
}

const initialState = {
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  cartItems: [],
  selectedItems: [],
  loading: false,
  updating: null,
  clearing: false,
  cartCount: 0,
};

export const useCartStore = create<CartState>((set, get) => ({
  ...initialState,

  updateCartCount: () => {
    const { cartItems } = get();
    const count = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    set({ cartCount: count });
  },

  setUserId: (userId) => {
    set({ userId });
    if (userId) get().fetchCart();
    else set({ cartItems: [], selectedItems: [], cartCount: 0 });
  },

  fetchCart: async () => {
    const { userId } = get();
    if (!userId) return;

    set({ loading: true });
    try {
      const items = await getCart(userId);
      const mapped = items.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        title: i.title || "Sản phẩm thể thao",
        price: i.price || 0,
        images: i.images || [],
        product: i,
      }));
      set({ cartItems: mapped });
      get().updateCartCount();
    } catch {
      // Keep local cart items
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (id, change) => {
    const { cartItems, userId } = get();
    const newItems = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartProductItem[];

    set({ cartItems: newItems });
    get().updateCartCount();

    if (userId) {
      try {
        await updateCartItem(userId, id, change);
      } catch {}
    }
  },

  removeItem: async (id) => {
    const { cartItems, userId } = get();
    const newItems = cartItems.filter((item) => item.id !== id);
    set({ cartItems: newItems });
    get().updateCartCount();

    if (userId) {
      try {
        await deleteCartItem(userId, id);
      } catch {}
    }
  },

  removeAll: async () => {
    const { userId } = get();
    set({ cartItems: [], selectedItems: [], cartCount: 0 });

    if (userId) {
      try {
        await clearCart(userId);
      } catch {}
    }
  },

  toggleSelect: (id) => {
    const { selectedItems } = get();
    set({
      selectedItems: selectedItems.includes(id)
        ? selectedItems.filter((i) => i !== id)
        : [...selectedItems, id],
    });
  },

  toggleSelectAll: () => {
    const { cartItems, selectedItems } = get();
    const allIds = cartItems.map((i) => i.id);
    set({
      selectedItems: selectedItems.length === allIds.length ? [] : allIds,
    });
  },

  addItemToCart: async ({
    id,
    title,
    stock = 10,
    quantity,
    price,
    images = [],
    navigate,
  }) => {
    const { cartItems, userId } = get();

    const existingIndex = cartItems.findIndex((item) => item.id === id);
    let newItems = [...cartItems];

    if (existingIndex > -1) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + quantity,
      };
    } else {
      newItems.push({
        id,
        title,
        price,
        quantity,
        stock,
        images,
      });
    }

    set({ cartItems: newItems });
    get().updateCartCount();

    if (userId) {
      try {
        await addToCart(userId, id, quantity);
      } catch {}
    }
  },

  reset: () => set(initialState),
}));
