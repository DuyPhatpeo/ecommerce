import React from "react";

interface Props {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onPlaceOrder: () => void;
}

const CheckoutSummary: React.FC<Props> = ({
  subtotal,
  tax,
  shipping,
  total,
  onPlaceOrder,
}) => {
  return (
    <div className="sticky top-30 bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
      </div>
      <div className="p-8 space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span>${tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `$${shipping.toLocaleString()}`
            )}
          </span>
        </div>
        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-orange-600">${total.toLocaleString()}</span>
        </div>

        <button
          onClick={onPlaceOrder}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
