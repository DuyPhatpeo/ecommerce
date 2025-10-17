import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";
import { getProductById } from "../../api/productApi";

interface Product {
  id: number;
  title: string;
  images?: string[];
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
  selectedItems: { id: number; quantity: number }[];
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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results: (Product & { quantity: number })[] = [];

        for (const item of selectedItems) {
          const cartItemRes = await getCartItem(item.id);
          const cartItem: CartItem = cartItemRes.data || cartItemRes;

          const productRes = await getProductById(cartItem.productId);
          const product: Product = productRes.data || productRes;

          const fullItem = { ...product, quantity: item.quantity };
          results.push(fullItem);
        }

        setProducts(results);
      } catch (err) {
        console.error("❌ Error fetching checkout data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedItems.length > 0) fetchProducts();
  }, [selectedItems]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    const orderData = {
      products,
      customerInfo,
      subtotal,
      tax,
      shipping,
      total,
    };
    console.log("🛒 Confirm Order Data:", orderData);
    alert("Order placed successfully! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Form */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer Information
                </h2>
                <p className="text-orange-100 text-sm mt-1">
                  Please provide your contact details
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Form */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Shipping Address
                </h2>
                <p className="text-orange-100 text-sm mt-1">
                  Enter your delivery address
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={customerInfo.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="Manhattan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ward/Area
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={customerInfo.ward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="Upper East Side"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="House number, street name..."
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={customerInfo.note}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                      placeholder="Notes about your order, e.g. special delivery instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Method
                </h2>
                <p className="text-orange-100 text-sm mt-1">
                  Choose your preferred payment option
                </p>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={customerInfo.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-600"
                    />
                    <div className="ml-4 flex items-center gap-3 flex-1">
                      <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-sm text-gray-500">
                          Pay with cash when you receive your order
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="banking"
                      checked={customerInfo.paymentMethod === "banking"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-600"
                    />
                    <div className="ml-4 flex items-center gap-3 flex-1">
                      <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          Bank Transfer
                        </span>
                        <p className="text-sm text-gray-500">
                          Pay via bank account transfer
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={customerInfo.paymentMethod === "momo"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-600"
                    />
                    <div className="ml-4 flex items-center gap-3 flex-1">
                      <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          Digital Wallet
                        </span>
                        <p className="text-sm text-gray-500">
                          Pay via digital wallet (MoMo, PayPal, etc.)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
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
                  in your order
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
                        className="group relative bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 hover:shadow-md transition-all duration-300 border border-orange-100"
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                              {index + 1}
                            </div>
                            <img
                              src={
                                Array.isArray(p.images)
                                  ? p.images[0]
                                  : p.image || "/placeholder.png"
                              }
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
                            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
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
                      className="w-24 h-24 mx-auto text-orange-200 mb-4"
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
                      No items in your order
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-30 bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
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
                    <span className="text-lg font-semibold">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Tax (10%)</span>
                    <span className="text-lg font-semibold">
                      ${tax.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Shipping Fee</span>
                    <span className="text-lg font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="border-t-2 border-dashed border-orange-200 pt-4 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
                >
                  <span>Place Order</span>
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
                    className="w-5 h-5 text-orange-500"
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
