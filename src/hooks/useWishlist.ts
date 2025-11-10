// src/hooks/useWishlist.ts
import { useState, useEffect, useCallback } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../api/wishlistApi";
import { toast } from "react-toastify";

export const useWishlist = (productId: string) => {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ✅ Theo dõi userId trong localStorage nếu bị thay đổi */
  useEffect(() => {
    const syncUserId = () => {
      const stored = localStorage.getItem("userId");
      setUserId(stored);
    };

    // khi login/logout trong tab khác
    window.addEventListener("storage", syncUserId);

    // khi trang hiện tại login/logout
    syncUserId();

    return () => window.removeEventListener("storage", syncUserId);
  }, []);

  /* ✅ Kiểm tra xem product có trong wishlist không */
  useEffect(() => {
    const check = async () => {
      if (!userId) {
        setIsWishlisted(false);
        setLoading(false);
        return;
      }

      const exists = await isInWishlist(userId, productId);
      setIsWishlisted(exists);
      setLoading(false);
    };

    check();
  }, [userId, productId]);

  /* ✅ Toggle Wishlist */
  const handleToggleWishlist = useCallback(async () => {
    // ✅ luôn kiểm tra lại userId mỗi lần bấm
    const currentUserId = localStorage.getItem("userId");

    if (!currentUserId) {
      toast.error("You need to login to add to favorites");
      return;
    }

    setUserId(currentUserId);

    if (isWishlisted) {
      await removeFromWishlist(currentUserId, productId);
      setIsWishlisted(false);
      toast("Removed from favorites");
    } else {
      await addToWishlist(currentUserId, productId);
      setIsWishlisted(true);
      toast.success("Added to favorites");
    }
  }, [productId, isWishlisted]);

  return { isWishlisted, handleToggleWishlist, loading };
};
