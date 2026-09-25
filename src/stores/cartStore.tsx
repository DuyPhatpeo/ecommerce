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

    // Show Custom Toast
    toast(
      <div className="flex items-start gap-4 w-full">
        <div className="w-24 h-24 bg-gray-50 flex-shrink-0 border border-gray-100 p-2">
          <img 
            src={images[0] || "/images/default_sneaker.png"} 
            alt={title} 
            className="w-full h-full object-contain mix-blend-multiply"
            onError={(e) => { e.currentTarget.src = "/images/default_sneaker.png"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
          <div className="text-xs text-gray-500 mt-0.5 font-medium">
            {price.toLocaleString("vi-VN")}₫ x {quantity}
          </div>
          <a href="/cart" className="inline-block mt-2.5 bg-primary text-black font-bold text-[11px] px-3 py-1.5 uppercase rounded-none hover:bg-gray-900 hover:text-white transition-colors w-full text-center">
            Xem giỏ hàng
          </a>
        </div>
      </div>,
      {
        theme: "light",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        style: { borderRadius: 0, padding: "16px", minWidth: "300px" },
        closeButton: true,
      }
    );

    if (userId) {
      try {
        await addToCart(userId, id, quantity);
      } catch {}
    }
  },

  reset: () => set(initialState),
}));
