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

  /* ---------- Tính tổng tiền ---------- */
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

  /* ---------- Load danh sách sản phẩm ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result: (Product & { quantity: number })[] = [];

        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Vui lòng đăng nhập để thanh toán!");
          navigate("/login");
          return;
        }

        if (state.selectedItems?.length) {
          for (const item of state.selectedItems) {
            const cartRes = await getCartItem(userId, item.id);
            if (!cartRes) continue; // ❌ bỏ qua nếu item không tồn tại

            const productRes = await getProductById(cartRes.productId);
            if (!productRes) continue; // ❌ bỏ qua nếu sản phẩm không tồn tại

            result.push({
              ...productRes,
              quantity: item.quantity,
            });
          }
        } else if (state.productId && state.quantity) {
          const productRes = await getProductById(state.productId);
          if (productRes) {
            result.push({ ...productRes, quantity: state.quantity });
          }
        }

        if (!result.length) {
          toast.error("Không có sản phẩm nào để thanh toán!");
          navigate("/", { replace: true });
          return;
        }

        setProducts(result);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải dữ liệu sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [state, navigate]);

  /* ---------- Xử lý đặt hàng ---------- */
  const handlePlaceOrder = useCallback(async () => {
    if (!customerInfo) {
      toast.error("Vui lòng nhập thông tin giao hàng!");
      return;
    }

    const { recipientName, phone, address, paymentMethod, note } = customerInfo;
    if (!recipientName || !phone || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // ✅ Lấy userId từ localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!"
      );
      navigate("/login");
      return;
    }

    try {
      setPlacingOrder(true);
      const loadingToast = toast.loading("Đang xử lý đơn hàng...");

      // Lấy thông tin sản phẩm mới nhất
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

      // ✅ Xác định trạng thái đơn hàng dựa theo phương thức thanh toán
      let status: string;
      switch (paymentMethod) {
        case "cod":
          status = "pending"; // Thanh toán khi nhận hàng
          break;
        case "banking":
          status = "banking"; // Đang chờ thanh toán qua ngân hàng
          break;
        case "momo":
          status = "paid"; // Đã thanh toán thành công qua Momo
          break;
        default:
          status = "pending";
          break;
      }

      // ✅ Dữ liệu đơn hàng gửi lên API
      const orderData = {
        customer: {
          id: userId, // 🔥 Gắn userId từ local
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
      toast.success("Đặt hàng thành công!");

      localStorage.removeItem("checkoutItems");
      navigate("/order-success", { state: { order: res }, replace: true });
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Không thể đặt hàng, vui lòng thử lại!");
    } finally {
      setPlacingOrder(false);
    }
  }, [customerInfo, products, subtotal, tax, shipping, total, navigate]);

  /* ---------- Trả về các giá trị ---------- */
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
