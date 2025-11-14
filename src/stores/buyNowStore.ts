import { create } from "zustand";
import { toast } from "react-toastify";
import type { NavigateFunction } from "react-router-dom";

type BuyNowPayload = {
  id: string;
  quantity: number;
  price: number;
  stock: number;
  image?: string;
};

type BuyNowState = {
  handleBuyNow: (
    payload: BuyNowPayload,
    navigate: NavigateFunction | null
  ) => void;
};

export const useBuyNowStore = create<BuyNowState>(() => ({
  handleBuyNow: (payload, navigate) => {
    if (!navigate) {
      toast.error("Navigation not ready!");
      return;
    }

    const { id, quantity, price, stock } = payload;

    if (stock <= 0) return toast.error("This product is out of stock!");
    if (!price || price <= 0)
      return toast.error("This product does not have a valid price!");

    const subtotal = price * quantity;
    const tax = subtotal * 0.1;
    const shipping = 30000;
    const total = subtotal + tax + shipping;

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
}));
