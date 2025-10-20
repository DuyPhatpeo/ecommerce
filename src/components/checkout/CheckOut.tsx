import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";
import { getProductById } from "../../api/productApi";
import { createOrder } from "../../api/orderApi";
import CheckoutForm from "./CheckoutForm";
import CheckoutProductList from "./CheckoutProductList";
import CheckoutSummary from "./CheckoutSummary";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  price: number;
  images?: string[];
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

const CheckOut: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // 🔸 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results: (Product & { quantity: number })[] = [];
        for (const item of selectedItems) {
          const cartItemRes = await getCartItem(item.id);
          const cartItem = cartItemRes.data || cartItemRes;
          const productRes = await getProductById(cartItem.productId);
          const product = productRes.data || productRes;
          results.push({ ...product, quantity: item.quantity });
        }
        setProducts(results);
      } catch (err) {
        console.error("❌ Error fetching checkout data:", err);
        toast.error("Failed to load products for checkout.");
      } finally {
        setLoading(false);
      }
    };
    if (selectedItems.length > 0) fetchProducts();
  }, [selectedItems]);

  // 🔸 Handle place order
  const handlePlaceOrder = async () => {
    if (!customerInfo) {
      toast.error("⚠️ Please fill out your customer information first!");
      return;
    }

    const { fullName, email, phone, address, city } = customerInfo;
    if (!fullName || !email || !phone || !address || !city) {
      toast.error(
        "❌ Please complete all required fields before placing order."
      );
      return;
    }

    const orderData = {
      customer: customerInfo,
      items: products.map((p) => ({
        productId: p.id,
        title: p.title,
        quantity: p.quantity,
        price: p.price,
      })),
      subtotal,
      tax,
      shipping,
      total,
      createdAt: new Date().toISOString(),
    };

    try {
      setPlacingOrder(true);
      toast.loading("Processing your order...");
      const response = await createOrder(orderData);
      toast.dismiss();
      toast.success("🎉 Order placed successfully!");
      console.log("✅ Order created:", response);

      // Clear or redirect
      navigate("/order-success", { state: { order: response } });
    } catch (error) {
      console.error("❌ Failed to place order:", error);
      toast.dismiss();
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
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
          <div className="lg:col-span-2 space-y-6">
            <CheckoutForm onChange={setCustomerInfo} />
            <CheckoutProductList products={products} loading={loading} />
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              customerInfo={customerInfo}
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
