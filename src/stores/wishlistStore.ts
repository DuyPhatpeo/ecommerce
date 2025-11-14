// stores/WishlistStore.ts
import { create } from "zustand";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../api/wishlistApi";
import { toast } from "react-toastify";

interface WishlistState {
  // State
  wishlistedProducts: Set<string>;
  loading: Record<string, boolean>;
  userId: string | null;

  // Actions
  setUserId: (userId: string | null) => void;
  checkWishlistStatus: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  // ✅ Initial state
  wishlistedProducts: new Set<string>(),
  loading: {},
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,

  // ✅ Set user ID
  setUserId: (userId) => {
    set({ userId });
  },

  // ✅ Check if product is in wishlist
  checkWishlistStatus: async (productId: string) => {
    const { userId } = get();

    if (!userId) {
      set((state) => {
        const newWishlisted = new Set(state.wishlistedProducts);
        newWishlisted.delete(productId);
        return { wishlistedProducts: newWishlisted };
      });
      return;
    }

    set((state) => ({
      loading: { ...state.loading, [productId]: true },
    }));

    try {
      const exists = await isInWishlist(userId, productId);

      set((state) => {
        const newWishlisted = new Set(state.wishlistedProducts);
        if (exists) {
          newWishlisted.add(productId);
        } else {
          newWishlisted.delete(productId);
        }
        return {
          wishlistedProducts: newWishlisted,
          loading: { ...state.loading, [productId]: false },
        };
      });
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      set((state) => ({
        loading: { ...state.loading, [productId]: false },
      }));
    }
  },

  // ✅ Toggle wishlist
  toggleWishlist: async (productId: string) => {
    // ✅ Luôn kiểm tra lại userId từ localStorage
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!currentUserId) {
      toast.error("You need to login to add to favorites");
      return;
    }

    // Update userId nếu thay đổi
    const { userId } = get();
    if (userId !== currentUserId) {
      set({ userId: currentUserId });
    }

    const { wishlistedProducts } = get();
    const isCurrentlyWishlisted = wishlistedProducts.has(productId);

    // Optimistic update
    set((state) => {
      const newWishlisted = new Set(state.wishlistedProducts);
      if (isCurrentlyWishlisted) {
        newWishlisted.delete(productId);
      } else {
        newWishlisted.add(productId);
      }
      return { wishlistedProducts: newWishlisted };
    });

    try {
      if (isCurrentlyWishlisted) {
        await removeFromWishlist(currentUserId, productId);
        toast.success("Removed from favorites");
      } else {
        await addToWishlist(currentUserId, productId);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);

      // Rollback on error
      set((state) => {
        const newWishlisted = new Set(state.wishlistedProducts);
        if (isCurrentlyWishlisted) {
          newWishlisted.add(productId);
        } else {
          newWishlisted.delete(productId);
        }
        return { wishlistedProducts: newWishlisted };
      });
      toast.error("Something went wrong");
    }
  },

  // ✅ Check if product is wishlisted
  isWishlisted: (productId: string) => {
    const { wishlistedProducts } = get();
    return wishlistedProducts.has(productId);
  },

  // ✅ Clear wishlist (khi logout)
  clearWishlist: () => {
    set({ wishlistedProducts: new Set<string>(), loading: {} });
  },
}));

// ✅ Sync userId với localStorage (chỉ chạy trên client)
if (typeof window !== "undefined") {
  // Sync khi storage event xảy ra (login/logout từ tab khác)
  window.addEventListener("storage", (e) => {
    if (e.key === "userId") {
      useWishlistStore.getState().setUserId(e.newValue);

      // Clear wishlist nếu user logout
      if (!e.newValue) {
        useWishlistStore.getState().clearWishlist();
      }
    }
  });
}
