import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById } from "../api/productApi";
import { createOrder } from "../api/orderApi";

interface Product {
  id: string;
  regularPrice?: number;
  salePrice?: number;
  images?: string[];
}

interface CheckoutData {
  productId?: string;
  quantity?: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
}

export interface CustomerInfo {
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: "cod" | "banking" | "momo";
}

interface UseCheckoutProps {
  state: CheckoutData;
}

export const useCheckout = ({ state }: UseCheckoutProps) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  /* ------------------ Tính toán subtotal / total ------------------ */
  const subtotal = useMemo(() => {
    if (state.subtotal !== undefined) return state.subtotal;
    return products.reduce((sum, p) => {
      const price =
        p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice || 0;
      return sum + price * p.quantity;
    }, 0);
  }, [state.subtotal, products]);

  const tax = state.tax ?? 0;
  const shipping = state.shipping ?? 0;
  const total = state.total ?? subtotal + tax + shipping;

  /* ------------------ Lấy dữ liệu sản phẩm ------------------ */
  useEffect(() => {
    const fetchProduct = async () => {
      if (!state.productId || !state.quantity) {
        toast.error("Không có sản phẩm nào để thanh toán!");
        navigate("/", { replace: true });
        return;
      }

      setLoading(true);
      try {
        const res = await getProductById(state.productId);
        const product = res?.data || res;
        setProducts([{ ...product, quantity: state.quantity }]);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu sản phẩm!");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [state.productId, state.quantity, navigate]);

  /* ------------------ Xử lý đặt hàng ------------------ */
  const handlePlaceOrder = useCallback(async () => {
    if (!customerInfo) {
      toast.error("Vui lòng nhập thông tin giao hàng!");
      return;
    }

    const { recipientName, phone, address, paymentMethod } = customerInfo;
    if (!recipientName || !phone || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setPlacingOrder(true);
      const loadingToast = toast.loading("Đang xử lý đơn hàng...");

      // Lấy giá mới nhất
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

      const status = paymentMethod === "cod" ? "pending" : "paid";

      const orderData = {
        customer: customerInfo,
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
      toast.success("Đặt hàng thành công!");
      localStorage.removeItem("checkoutItems");
      navigate("/order-success", { state: { order: res }, replace: true });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Không thể đặt hàng, vui lòng thử lại!");
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
