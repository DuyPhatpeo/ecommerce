import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface WishlistItem {
  id: string;
  title: string;
  img: string;
  price: number;
}

/** 🧩 Hook quản lý Wishlist (localStorage + trạng thái) */
export const useWishlist = (product: WishlistItem) => {
  const { id, title, img, price } = product;
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 🔹 Load từ localStorage khi khởi tạo
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = stored.some((item: WishlistItem) => item.id === id);
      setIsWishlisted(exists);
    } catch {}
  }, [id]);

  // 🔹 Toggle thêm / xóa
  const handleToggleWishlist = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = stored.find((item: WishlistItem) => item.id === id);

      if (exists) {
        const updated = stored.filter((item: WishlistItem) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(false);
        toast("Removed from wishlist 💔");
      } else {
        const updated = [...stored, { id, title, img, price }];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(true);
        toast.success("Added to wishlist 💕");
      }
    } catch {
      toast.error("Wishlist update failed.");
    }
  }, [id, title, img, price]);

  return { isWishlisted, handleToggleWishlist };
};
