// src/hooks/useAddToCart.ts
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../api/cartApi";
import Button from "../components/ui/Button";

interface AddToCartParams {
  id: string;
  title: string;
  stock: number;
  quantity: number;
  price: number;
  images?: string[];
  setLoading: (v: boolean) => void;
}

export const useAddToCart = () => {
  const navigate = useNavigate();

  const showCartToast = useCallback(
    (title: string, imageUrl: string, price: number, quantity: number) => {
      toast(
        <div className="flex items-center gap-4 p-4 w-[360px] min-h-[110px] ">
          <img
            src={imageUrl || "/placeholder.jpg"}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
          />
          <div className="flex flex-col justify-between flex-1 text-sm">
            <p className="font-semibold text-gray-800 truncate">{title}</p>
            <p className="text-gray-600">
              Added{" "}
              <span className="text-orange-500 font-semibold">{quantity}</span>{" "}
              item(s)
            </p>
            {price > 0 && (
              <p className="text-gray-700 font-medium">
                {price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            )}
            <Button
              label="View cart"
              onClick={() => navigate("/cart")}
              className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg mt-2"
            />
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
    },
    [navigate]
  );

  const handleAddToCart = useCallback(
    async ({
      id,
      title,
      stock,
      quantity,
      price,
      images,
      setLoading,
    }: AddToCartParams) => {
      const userId = localStorage.getItem("userId");
      if (!userId)
        return toast.error("You need to login to add products to cart!");
      if (quantity > stock)
        return toast.error(`Only ${stock} items left in stock!`);

      setLoading(true);
      try {
        await addToCart(userId, id, quantity);
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
