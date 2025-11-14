import { create } from "zustand";
import { toast } from "react-toastify";
type NavigateFn = (
  to: string | number,
  options?: { replace?: boolean; state?: any }
) => void;

type BuyNowPayload = {
  id: string;
  quantity: number;
  price: number;
  stock: number;
  image?: string;
};

type BuyNowState = {
  handleBuyNow: (payload: BuyNowPayload, navigate: NavigateFn | null) => void;
};

export const useBuyNowStore = create<BuyNowState>((set) => ({
  handleBuyNow: (payload, navigate) => {
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
