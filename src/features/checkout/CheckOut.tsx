import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { useCheckoutStore } from "../../stores/checkoutStore";

const CheckOut: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const {
    products,
    subtotal,
    tax,
    shipping,
    total,
    customerInfo,
    setCustomerInfo,
    fetchProducts,
  } = useCheckoutStore();

  // Load sản phẩm khi vào trang Checkout
  useEffect(() => {
    fetchProducts({
      selectedItems: state.selectedItems,
      productId: state.productId,
      quantity: state.quantity,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      total: state.total,
      navigate,
    });
  }, [
    state.selectedItems,
    state.productId,
    state.quantity,
    state.subtotal,
    state.tax,
    state.shipping,
    state.total,
    navigate,
    fetchProducts,
  ]);

  // Hàm chuyển sang trang confirm-payment
  const handleGoToConfirm = () => {
    if (!customerInfo) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }

    const { recipientName, phone, address } = customerInfo;

    if (!recipientName || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    navigate("/confirm-payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 md:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form thông tin */}
          <div className="space-y-6 lg:col-span-2">
            <CheckoutForm onChange={setCustomerInfo} />
          </div>

          {/* Tóm tắt */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              products={products}
              customerInfo={
                customerInfo
                  ? {
                      name: customerInfo.recipientName,
                      phone: customerInfo.phone,
                      address: customerInfo.address,
                    }
                  : undefined
              }
              onPlaceOrder={handleGoToConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
