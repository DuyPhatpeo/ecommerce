import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";
import { getProductById } from "../../api/productApi";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface CheckoutData {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  selectedItems: string[];
}

const MainCheckOut: React.FC = () => {
  const location = useLocation();
  const {
    selectedItems = [],
    subtotal = 0,
    tax = 0,
    shipping = 0,
    total = 0,
  } = (location.state as CheckoutData) || {};

  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results: (Product & { quantity: number })[] = [];
        console.log("🛒 Selected Cart IDs:", selectedItems);

        for (const cartId of selectedItems) {
          const cartItemRes = await getCartItem(Number(cartId));
          const cartItem: CartItem = cartItemRes.data || cartItemRes;
          console.log("📦 Cart Item:", cartItem);

          const productRes = await getProductById(cartItem.productId);
          const product: Product = productRes.data || productRes;
          console.log("🧾 Product Info:", product);

          const fullItem = { ...product, quantity: cartItem.quantity };
          results.push(fullItem);

          console.log("✅ Combined Item:", fullItem);
        }

        setProducts(results);
        console.log("🎉 Final Product List for Checkout:", results);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu checkout:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedItems.length > 0) fetchProducts();
  }, [selectedItems]);

  const handleConfirmOrder = () => {
    const orderData = {
      products,
      subtotal,
      tax,
      shipping,
      total,
    };
    console.log("🛒 Confirm Order Data:", orderData);
    alert("Order confirmed! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Order Items
                </h2>
                <p className="text-orange-100 mt-1">
                  {products.length} {products.length === 1 ? "item" : "items"}{" "}
                  selected
                </p>
              </div>

              <div className="p-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
                    <p className="text-gray-500 mt-4 font-medium">
                      Loading your items...
                    </p>
                  </div>
                ) : products.length > 0 ? (
                  <div className="space-y-6">
                    {products.map((p, index) => (
                      <div
                        key={p.id}
                        className="group relative bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200"
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                              {index + 1}
                            </div>
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-24 h-24 rounded-xl object-cover shadow-md ring-2 ring-white"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                              {p.title}
                            </h3>
                            <div className="flex items-center gap-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                                Qty: {p.quantity}
                              </span>
                              <span className="text-gray-600">
                                ${p.price.toLocaleString()} each
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">
                              Subtotal
                            </div>
                            <div className="text-2xl font-bold text-orange-600">
                              ${(p.price * p.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      No items in your checkout
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Order Summary
                </h2>
              </div>

              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="text-lg">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Tax</span>
                    <span className="text-lg">${tax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Shipping</span>
                    <span className="text-lg">
                      ${shipping.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-bold text-orange-600">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
                >
                  <span>Confirm Order</span>
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCheckOut;
