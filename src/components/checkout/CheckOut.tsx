import { useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import CheckoutProductList from "./CheckoutProductList";
import CheckoutSummary from "./CheckoutSummary";
import { useCheckout } from "../../hooks/useCheckout";

const CheckOut: React.FC = () => {
  const location = useLocation();
  const state = location.state || {};

  const {
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
  } = useCheckout({ state });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 md:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CheckoutForm onChange={setCustomerInfo} />
            <CheckoutProductList products={products} loading={loading} />
          </div>
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
