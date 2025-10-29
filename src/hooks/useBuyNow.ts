import { useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * ✅ Hook xử lý "Mua ngay"
 * - Nếu có `salePrice` → dùng giá giảm
 * - Nếu không có → fallback sang `price gốc`
 */
export const useBuyNow = () => {
  const navigate = useNavigate();

  const handleBuyNow = useCallback(
    ({
      id,
      quantity,
      salePrice,
      price,
      stock,
    }: {
      id: string;
      quantity: number;
      salePrice?: number; // 👈 thêm trường này để linh hoạt
      price?: number;
      stock: number;
    }) => {
      // ❌ Hết hàng
      if (stock <= 0) {
        toast.error("This product is out of stock!");
        return;
      }

      // ✅ Chọn giá ưu tiên: salePrice nếu có, ngược lại dùng price
      const finalPrice =
        typeof salePrice === "number" && salePrice > 0
          ? salePrice
          : typeof price === "number"
          ? price
          : 0;

      // ❌ Không có giá hợp lệ
      if (finalPrice <= 0) {
        toast.error("This product does not have a valid price!");
        return;
      }

      // ✅ Tính toán đơn hàng tạm
      const subtotal = finalPrice * quantity;
      const tax = subtotal * 0.1;
      const shipping = 30000;
      const total = subtotal + tax + shipping;

      // ✅ Điều hướng sang trang thanh toán
      navigate("/checkout", {
        state: {
          productId: id,
          quantity,
          subtotal,
          tax,
          shipping,
          total,
        },
      });

      toast.success("Redirecting to checkout...");
    },
    [navigate]
  );

  return { handleBuyNow };
};
