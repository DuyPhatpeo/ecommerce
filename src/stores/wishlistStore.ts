// stores/WishlistStore.ts
import { create } from "zustand";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlist,
} from "../api/wishlistApi";
import { getProductById } from "../api/productApi";
import { toast } from "react-toastify";

interface Product {
  id: string;
  title: string;
  img: string;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
}

interface WishlistState {
  // State
  wishlistedProducts: Set<string>;
  wishlistItems: Product[];
  loading: Record<string, boolean>;
  isLoadingList: boolean;
  userId: string | null;

  // Actions
  setUserId: (userId: string | null) => void;
  checkWishlistStatus: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  fetchWishlistItems: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  // ✅ Initial state
  wishlistedProducts: new Set<string>(),
  wishlistItems: [],
  loading: {},
  isLoadingList: false,
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,

  // ✅ Set user ID
  setUserId: (userId) => {
    set({ userId });
  },

  // ✅ Fetch wishlist items (danh sách sản phẩm)
  fetchWishlistItems: async () => {
    const { userId } = get();

    if (!userId) {
      set({ wishlistItems: [], isLoadingList: false });
      return;
    }

    set({ isLoadingList: true });

    try {
      const wishlistData = await getWishlist(userId);

      if (!wishlistData.length) {
        set({ wishlistItems: [], isLoadingList: false });
        return;
      }

      // Sắp xếp từ mới đến cũ
      wishlistData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });

      // ❗ FIX BUG: dùng Promise.allSettled để không crash khi có sản phẩm bị xóa
      const productResults = await Promise.allSettled(
        wishlistData.map((item) => getProductById(item.productId))
      );

      const validProducts: Product[] = [];
      const invalidIds: string[] = [];

      productResults.forEach((res, index) => {
        if (res.status === "fulfilled") {
          const p = res.value;
          validProducts.push({
            ...p,
            img: p.images?.[0] || "/placeholder.png",
          });
        } else {
          // ❗ ID sản phẩm đã bị xóa khỏi database
          invalidIds.push(wishlistData[index].productId);
        }
      });

      // ❗ Nếu có sản phẩm chết → xóa khỏi wishlist DB
      if (invalidIds.length > 0) {
        console.warn("Removed invalid wishlist product IDs:", invalidIds);

        for (const id of invalidIds) {
          await removeFromWishlist(userId, id);
        }
      }

      // Set state
      const productIds = new Set(validProducts.map((p) => p.id));

      set({
        wishlistItems: validProducts,
        wishlistedProducts: productIds,
        isLoadingList: false,
      });
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      toast.error("Không thể tải danh sách yêu thích.");
      set({ isLoadingList: false });
    }
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

        // ✅ Reload lại danh sách sau khi xóa
        get().fetchWishlistItems();
      } else {
        await addToWishlist(currentUserId, productId);
        toast.success("Added to favorites");

        // ✅ Reload lại danh sách sau khi thêm
        get().fetchWishlistItems();
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
    set({
      wishlistedProducts: new Set<string>(),
      wishlistItems: [],
      loading: {},
    });
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
      } else {
        // Load wishlist khi user login
        useWishlistStore.getState().fetchWishlistItems();
      }
    }
  });
}
