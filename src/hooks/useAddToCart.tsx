// src/hooks/useAddToCart.ts
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../api/cartApi";
import Button from "../components/ui/Button";
import { X } from "lucide-react";

/**
 * Hook xử lý thêm sản phẩm vào giỏ hàng
 */
export const useAddToCart = () => {
  const navigate = useNavigate();

  const formatVND = (val: number) =>
    val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  /** Hiển thị toast tuỳ chỉnh khi thêm vào giỏ */
  const showCartToast = useCallback(
    (title: string, imageUrl: string, price: number, quantity: number) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-4 p-4 max-w-sm bg-white shadow-lg rounded-xl relative transition-all ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            <img
              src={imageUrl || "/placeholder.jpg"}
              alt={title}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-gray-800 line-clamp-1">
                {title}
              </p>
              <p className="text-gray-600">
                Added{" "}
                <span className="text-orange-500 font-semibold">
                  {quantity}
                </span>{" "}
                item(s)
              </p>
              {price > 0 && (
                <p className="text-gray-700 font-medium">{formatVND(price)}</p>
              )}
              <Button
                label="View cart"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/cart");
                }}
                className="mt-2 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg"
              />
            </div>
            <Button
              onClick={() => toast.dismiss(t.id)}
              icon={<X size={16} />}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            />
          </div>
        ),
        { duration: 3000 }
      );
    },
    [navigate]
  );

  /** Hàm thực hiện thêm vào giỏ */
  const handleAddToCart = useCallback(
    async ({
      id,
      title,
      stock,
      quantity,
      price,
      images,
      setLoading,
    }: {
      id: string;
      title: string;
      stock: number;
      quantity: number;
      price: number;
      images?: string[];
      setLoading: (v: boolean) => void;
    }) => {
      if (quantity > stock) {
        toast.error(`Only ${stock} items left in stock!`);
        return;
      }

      setLoading(true);
      try {
        await addToCart(id, quantity);
        showCartToast(title, images?.[0] || "", price, quantity);
      } catch {
        toast.error("Failed to add product to cart!");
      } finally {
        setLoading(false);
      }
    },
    [showCartToast]
  );

  return { handleAddToCart };
};
