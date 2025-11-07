import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCartItem } from "../api/cartApi";
import { getProductById } from "../api/productApi";
import { createOrder } from "../api/orderApi";

/* =====================
   TYPES
===================== */
interface Product {
  id: string;
  title: string;
  regularPrice?: number;
  salePrice?: number;
  images?: string[];
}

interface CheckoutData {
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  selectedItems?: { id: string; quantity: number }[];
  productId?: string;
  quantity?: number;
}

export interface CustomerInfo {
  recipientName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "cod" | "banking" | "momo";
}

interface UseCheckoutProps {
  state: CheckoutData;
}

/* =====================
   HOOK
===================== */
export const useCheckout = ({ state }: UseCheckoutProps) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  /* ---------- Calculate totals ---------- */
  const subtotal = useMemo(
    () =>
      state.subtotal ??
      products.reduce((sum, p) => {
        const price =
          p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice || 0;
        return sum + price * p.quantity;
      }, 0),
    [state.subtotal, products]
  );

  const tax = state.tax ?? 0;
  const shipping = state.shipping ?? 0;
  const total = state.total ?? subtotal + tax + shipping;

  /* ---------- Fetch products helper ---------- */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to proceed with checkout!");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      let items: (Product & { quantity: number })[] = [];

      if (state.selectedItems?.length) {
        items = await Promise.all(
          state.selectedItems.map(async (item) => {
            const cartRes = await getCartItem(userId, item.id);
            if (!cartRes) return null;

            const productRes = await getProductById(cartRes.productId);
            if (!productRes) return null;

            return { ...productRes, quantity: item.quantity };
          })
        );
        items = items.filter(Boolean) as (Product & { quantity: number })[];
      } else if (state.productId && state.quantity) {
        const productRes = await getProductById(state.productId);
        if (productRes) items.push({ ...productRes, quantity: state.quantity });
      }

      if (!items.length) {
        toast.error("No products available for checkout!");
        navigate("/", { replace: true });
        return;
      }

      setProducts(items);
    } catch {
      toast.error("Failed to load product data!");
    } finally {
      setLoading(false);
    }
  }, [state, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------- Place order ---------- */
  const handlePlaceOrder = useCallback(async () => {
    if (!customerInfo) return toast.error("Please enter shipping information!");
    const { recipientName, phone, address, paymentMethod, note } = customerInfo;
    if (!recipientName || !phone || !address)
      return toast.error("Please fill in all required information!");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User information not found. Please login again!");
      navigate("/login");
      return;
    }

    setPlacingOrder(true);
    const loadingToast = toast.loading("Processing your order...");

    try {
      const updatedProducts = await Promise.all(
        products.map(async (p) => {
          const res = await getProductById(p.id);
          const current = res?.data || res;
          return {
            ...p,
            regularPrice: current.regularPrice,
            salePrice: current.salePrice,
          };
        })
      );

      const statusMap: Record<string, string> = {
        cod: "pending",
        banking: "banking",
        momo: "paid",
      };
      const status = statusMap[paymentMethod] ?? "pending";

      const orderData = {
        customer: {
          id: userId,
          recipientName,
          phone,
          address,
          note,
          paymentMethod,
        },
        items: updatedProducts.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice,
        })),
        subtotal,
        tax,
        shipping,
        total,
        status,
        createdAt: new Date().toISOString(),
      };

      const res = await createOrder(orderData);

      toast.dismiss(loadingToast);
      toast.success("Order placed successfully!");

      localStorage.removeItem("checkoutItems");
      navigate("/order-success", { state: { order: res }, replace: true });
    } catch {
      toast.dismiss();
      toast.error("Failed to place order, please try again!");
    } finally {
      setPlacingOrder(false);
    }
  }, [customerInfo, products, subtotal, tax, shipping, total, navigate]);

  return {
    products,
    loading,
    subtotal,
    tax,
    shipping,
    total,
    customerInfo,
    setCustomerInfo,
    placingOrder,
    handlePlaceOrder,
  };
};
