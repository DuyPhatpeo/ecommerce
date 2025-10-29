import { useEffect, useState } from "react";
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
  price?: number;
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
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
  paymentMethod: string;
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

  const subtotal = state.subtotal || 0;
  const tax = state.tax || 0;
  const shipping = state.shipping || 0;
  const total = state.total || 0;

  // Default empty customer info to satisfy CheckoutSummary type
  const defaultCustomerInfo: CustomerInfo = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
  };

  // 🔸 Fetch product(s)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results: (Product & { quantity: number })[] = [];

        // 🛒 CASE 1: Checkout từ Cart
        if (state.selectedItems && state.selectedItems.length > 0) {
          for (const item of state.selectedItems) {
            const cartItemRes = await getCartItem(item.id);
            const cartItem = cartItemRes.data || cartItemRes;
            const productRes = await getProductById(cartItem.productId);
            const product = productRes.data || productRes;
            results.push({ ...product, quantity: item.quantity });
          }
        }

        // 🧡 CASE 2: Checkout trực tiếp từ Product detail
        else if (state.productId && state.quantity) {
          const productRes = await getProductById(state.productId);
          const product = productRes.data || productRes;
          results.push({ ...product, quantity: state.quantity });
        }

        if (results.length === 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, navigate]);

  // 🔸 Handle place order
  const handlePlaceOrder = async () => {
    if (!customerInfo) {
      toast.error("⚠️ Vui lòng điền thông tin khách hàng trước!");
      return;
    }

    const { fullName, email, phone, address, city } = customerInfo;
    if (!fullName || !email || !phone || !address || !city) {
      toast.error("❌ Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    const calculatedSubtotal =
      subtotal ||
      products.reduce(
        (sum, p) => sum + (p.salePrice ?? p.price ?? 0) * p.quantity,
        0
      );

    const orderData = {
      customer: customerInfo,
      items: products.map((p) => ({
        productId: p.id,
        title: p.title,
        quantity: p.quantity,
        price: p.salePrice ?? p.price,
      })),
      subtotal: calculatedSubtotal,
      tax,
      shipping,
      total: total || calculatedSubtotal + tax + shipping,
      createdAt: new Date().toISOString(),
    };

    try {
      setPlacingOrder(true);
      const loadingToast = toast.loading("Đang xử lý đơn hàng...");
      const response = await createOrder(orderData);
      toast.dismiss(loadingToast);
      toast.success("🎉 Đặt hàng thành công!");
      navigate("/order-success", { state: { order: response } });
    } catch {
      toast.dismiss();
      toast.error("Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 pading">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form + Product list */}
          <div className="lg:col-span-2 space-y-6">
            <CheckoutForm onChange={setCustomerInfo} />
            <CheckoutProductList products={products} loading={loading} />
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={
                subtotal ||
                products.reduce(
                  (sum, p) => sum + (p.salePrice ?? p.price ?? 0) * p.quantity,
                  0
                )
              }
              tax={tax}
              shipping={shipping}
              total={
                total ||
                products.reduce(
                  (sum, p) => sum + (p.salePrice ?? p.price ?? 0) * p.quantity,
                  0
                )
              }
              // pass default when customerInfo is null to satisfy typing and avoid runtime crashes
              customerInfo={customerInfo ?? defaultCustomerInfo}
              onPlaceOrder={handlePlaceOrder}
            />
            {placingOrder && (
              <p className="text-center text-orange-500 mt-3 animate-pulse">
                Processing your order...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
