import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";
import { getProductById } from "../../api/productApi";
import { createOrder } from "../../api/orderApi";
import CheckoutForm from "./CheckoutForm";
import CheckoutProductList from "./CheckoutProductList";
import CheckoutSummary from "./CheckoutSummary";
import toast from "react-hot-toast";

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
  productId?: number;
  quantity?: number;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: string;
}

const CheckOut: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as CheckoutData) || {};

  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // 💰 Tính lại subtotal dựa trên giá hiện tại
  const subtotal = useMemo(
    () =>
      state.subtotal ??
      products.reduce(
        (sum, p) =>
          sum +
          ((p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice) ??
            0) *
            p.quantity,
        0
      ),
    [state.subtotal, products]
  );

  const tax = state.tax ?? 0;
  const shipping = state.shipping ?? 0;
  const total = state.total ?? subtotal + tax + shipping;

  // 🛒 Lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results: (Product & { quantity: number })[] = [];

        if (state.selectedItems?.length) {
          for (const item of state.selectedItems) {
            const cartItemRes = await getCartItem(item.id);
            const cartItem = cartItemRes.data || cartItemRes;

            const productRes = await getProductById(cartItem.productId);
            const product = productRes.data || productRes;

            results.push({ ...product, quantity: item.quantity });
          }
        } else if (state.productId && state.quantity) {
          const productRes = await getProductById(state.productId);
          const product = productRes.data || productRes;
          results.push({ ...product, quantity: state.quantity });
        }

        if (!results.length) {
          toast.error("Không có sản phẩm nào để thanh toán!");
          navigate("/");
          return;
        }

        setProducts(results);
      } catch {
        toast.error("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [state, navigate]);

  // 🧾 Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!customerInfo) {
      toast.error("⚠️ Vui lòng chọn hoặc nhập thông tin giao hàng!");
      return;
    }

    const { fullName, phone, address } = customerInfo;
    if (!fullName || !phone || !address) {
      toast.error("❌ Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setPlacingOrder(true);
      const loadingToast = toast.loading("Đang xử lý đơn hàng...");

      // 🧠 Cập nhật lại giá tại thời điểm checkout
      const updatedProducts = await Promise.all(
        products.map(async (p) => {
          const res = await getProductById(p.id);
          const current = res.data || res;
          return {
            ...p,
            regularPrice: current.regularPrice,
            salePrice: current.salePrice,
          };
        })
      );

      // 🧮 Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        customer: customerInfo,
        items: updatedProducts.map((p) => ({
          productId: p.id,
          title: p.title,
          quantity: p.quantity,
          price: p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice,
        })),
        subtotal: updatedProducts.reduce(
          (sum, p) =>
            sum +
            ((p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice) ??
              0) *
              p.quantity,
          0
        ),
        tax,
        shipping,
        total,
        createdAt: new Date().toISOString(),
      };

      // 📦 Gửi đơn hàng
      const response = await createOrder(orderData);
      toast.dismiss(loadingToast);
      toast.success("🎉 Đặt hàng thành công!");

      localStorage.removeItem("checkoutItems");
      navigate("/order-success", { state: { order: response }, replace: true });
    } catch {
      toast.dismiss();
      toast.error("Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 md:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 🧾 Form + Sản phẩm */}
          <div className="space-y-6 lg:col-span-2">
            <CheckoutForm onChange={setCustomerInfo} />
            <CheckoutProductList products={products} loading={loading} />
          </div>

          {/* 💰 Tổng kết đơn hàng */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              customerInfo={
                customerInfo ?? {
                  fullName: "",
                  phone: "",
                  address: "",
                  paymentMethod: "cod",
                }
              }
              onPlaceOrder={handlePlaceOrder}
            />

            {placingOrder && (
              <p className="mt-3 text-center text-orange-500 animate-pulse">
                Đang xử lý đơn hàng...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
