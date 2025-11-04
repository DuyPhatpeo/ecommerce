import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

/** 🧩 Hook quản lý Wishlist (chỉ lưu id trong localStorage) */
export const useWishlist = (productId: string) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 🔹 Load từ localStorage khi khởi tạo
  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setIsWishlisted(stored.includes(productId));
    } catch {
      setIsWishlisted(false);
    }
  }, [productId]);

  // 🔹 Toggle thêm / xóa id
  const handleToggleWishlist = useCallback(() => {
    try {
      const stored: string[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      if (stored.includes(productId)) {
        const updated = stored.filter((id) => id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(false);
        toast("Removed from wishlist 💔");
      } else {
        const updated = [...stored, productId];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(true);
        toast.success("Added to wishlist 💕");
      }
    } catch {
      toast.error("Wishlist update failed.");
    }
  }, [productId]);

  return { isWishlisted, handleToggleWishlist };
};
