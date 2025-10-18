import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";
import { getProductById } from "../../api/productApi";
import CheckoutForm from "./CheckoutForm";
import CheckoutProductList from "./CheckoutProductList";
import CheckoutSummary from "./CheckoutSummary";

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
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

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
      } finally {
        setLoading(false);
      }
    };
    if (selectedItems.length > 0) fetchProducts();
  }, [selectedItems]);

  const handleConfirmOrder = (customerInfo: any) => {
    const order = {
      products,
      customerInfo,
      subtotal,
      tax,
      shipping,
      total,
    };
    setOrderData(order);
    console.log("🛒 Confirm Order Data:", order);
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
          <div className="lg:col-span-2 space-y-6">
            <CheckoutForm onConfirm={handleConfirmOrder} />
            <CheckoutProductList products={products} loading={loading} />
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              onPlaceOrder={() => {
                if (!orderData)
                  alert("Please fill out your information first!");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCheckOut;
