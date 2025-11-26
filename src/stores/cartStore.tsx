import { create } from "zustand";
import { toast } from "react-toastify";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  addToCart,
} from "../api/cartApi";
import { getProductById } from "../api/productApi";
import type { CartItem } from "../api/cartApi";

/* =====================
   TYPES
===================== */
interface CartState {
  userId: string | null;
  cartItems: (CartItem & { product?: any })[];
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
    stock: number;
    quantity: number;
    price: number;
    images?: string[];
    navigate: (path: string) => void;
  }) => Promise<void>;
  reset: () => void;
}

const initialState = {
  userId: localStorage.getItem("userId"),
  cartItems: [],
  selectedItems: [],
  loading: true,
  updating: null,
  clearing: false,
  cartCount: 0,
};

/* =====================
   ZUSTAND STORE
===================== */
export const useCartStore = create<CartState>((set, get) => ({
  ...initialState,

  /* =====================
     🔢 UPDATE CART COUNT
  ===================== */
  updateCartCount: () => {
    const total = get().cartItems.length;
    set({ cartCount: total });
  },

  /* =====================
     SET USER ID
  ===================== */
  setUserId: (userId) => set({ userId }),

  /* =====================
     🛒 FETCH CART
  ===================== */
  fetchCart: async () => {
    const { userId } = get();

    if (!userId) {
      set({ cartItems: [], loading: false });
      get().updateCartCount();
      return;
    }

    set({ loading: true });
    try {
      const cart = await getCart(userId);

      if (!cart || cart.length === 0) {
        set({ cartItems: [], selectedItems: [] });
        get().updateCartCount();
        return;
      }

      const products = await Promise.allSettled(
        cart.map((item) => getProductById(item.productId))
      );

      let merged = cart.map((item, i) => ({
        ...item,
        id: String(item.id),
        product:
          products[i].status === "fulfilled"
            ? products[i].value
            : { name: "Unknown", price: 0, stock: 0 },
      }));

      // 🆕 Sort theo createdAt: mới nhất lên đầu
      merged = merged.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      set({ cartItems: merged, selectedItems: [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart.");
    } finally {
      set({ loading: false });
      get().updateCartCount();
    }
  },

  /* =====================
     🔄 UPDATE QUANTITY
  ===================== */
  updateQuantity: async (id, change) => {
    const { userId, cartItems } = get();
    if (!userId) return;

    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);
    if (newQty === item.quantity) return;

    set({ updating: id });

    // Optimistic update
    set({
      cartItems: cartItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      ),
    });

    get().updateCartCount();

    try {
      await updateCartItem(userId, id, newQty);
    } catch {
      // Rollback
      set({
        cartItems: cartItems.map((i) =>
          i.id === id ? { ...i, quantity: item.quantity } : i
        ),
      });
      get().updateCartCount();
    } finally {
      set({ updating: null });
    }
  },

  /* =====================
     ❌ REMOVE ITEM
  ===================== */
  removeItem: async (id) => {
    const { userId, cartItems, selectedItems } = get();
    if (!userId) return;

    const prev = [...cartItems];

    set({
      cartItems: cartItems.filter((i) => i.id !== id),
      selectedItems: selectedItems.filter((sid) => sid !== id),
    });

    get().updateCartCount();

    try {
      await deleteCartItem(userId, id);
      toast.success("Item removed from cart.");
    } catch {
      set({ cartItems: prev });
      toast.error("Failed to remove item.");
      get().updateCartCount();
    }
  },

  /* =====================
     🧹 CLEAR CART
  ===================== */
  removeAll: async () => {
    const { userId, cartItems } = get();
    if (!userId || cartItems.length === 0) return;

    set({ clearing: true });

    const prev = [...cartItems];
    set({ cartItems: [], selectedItems: [] });
    get().updateCartCount();

    try {
      await clearCart(userId);
      toast.success("All items removed from cart.");
    } catch {
      set({ cartItems: prev });
      toast.error("Failed to clear cart.");
      get().updateCartCount();
    } finally {
      set({ clearing: false });
    }
  },

  /* =====================
     SELECT ITEMS
  ===================== */
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

    const validIds = cartItems
      .filter((i) => i.product?.stock > 0 && i.quantity <= i.product.stock)
      .map((i) => String(i.id));

    set({
      selectedItems: validIds.every((id) => selectedItems.includes(id))
        ? []
        : validIds,
    });
  },

  /* =====================
     ➕ ADD TO CART
  ===================== */
  addItemToCart: async ({
    id,
    title,
    stock,
    quantity,
    price,
    images,
    navigate,
  }) => {
    const { userId } = get();

    if (!userId) {
      toast.error("You need to login to add products to cart!");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items left in stock!`);
      return;
    }

    try {
      await addToCart(userId, id, quantity);

      // UI toast
      toast(
        <div className="flex items-center gap-4 p-4 w-[360px] min-h-[110px]">
          <img
            src={images?.[0] || "/placeholder.jpg"}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
          />

          <div className="flex flex-col justify-between flex-1 text-sm">
            <p className="font-semibold text-gray-800 overflow-hidden text-ellipsis line-clamp-2">
              {title}
            </p>

            <p className="text-gray-600 mt-1">
              Added{" "}
              <span className="text-orange-500 font-semibold">{quantity}</span>{" "}
              item(s)
            </p>

            {price > 0 && (
              <p className="text-gray-700 font-medium mt-1">
                {price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg mt-2 text-left"
            >
              View cart
            </button>
          </div>
        </div>,
        {
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          hideProgressBar: true,
        }
      );

      await get().fetchCart();
      get().updateCartCount();
    } catch {
      toast.error("Failed to add product to cart!");
    }
  },

  /* =====================
     RESET
  ===================== */
  reset: () => set(initialState),
}));
