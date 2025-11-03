import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCartItem } from "../api/cartApi";
import { getProductById } from "../api/productApi";
import { createOrder } from "../api/orderApi";

// Define product data type
interface Product {
  id: string;
  title: string;
  regularPrice?: number;
  salePrice?: number;
  images?: string[];
}

// Checkout data
interface CheckoutData {
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  selectedItems?: { id: string; quantity: number }[];
  productId?: number;
  quantity?: number;
}

// Customer information
interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: "cod" | "online"; // COD or online payment
}

// Hook input props
interface UseCheckoutProps {
  state: CheckoutData;
}

// Checkout hook
export const useCheckout = ({ state }: UseCheckoutProps) => {
  const navigate = useNavigate();

  // State to store products for checkout
  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [loading, setLoading] = useState(false); // Loading when fetching products
  const [placingOrder, setPlacingOrder] = useState(false); // Loading when placing order
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null); // Customer info

  // Calculate subtotal
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

  // Fetch products based on selectedItems or productId/quantity
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results: (Product & { quantity: number })[] = [];

        if (state.selectedItems?.length) {
          // Get each product from cart
          for (const item of state.selectedItems) {
            const cartItemRes = await getCartItem(item.id);
            const cartItem = cartItemRes.data || cartItemRes;

            const productRes = await getProductById(cartItem.productId);
            const product = productRes.data || productRes;

            results.push({ ...product, quantity: item.quantity });
          }
        } else if (state.productId && state.quantity) {
          // Direct checkout of a single product
          const productRes = await getProductById(state.productId);
          const product = productRes.data || productRes;
          results.push({ ...product, quantity: state.quantity });
        }

        if (!results.length) {
          toast.error("No products available for checkout!");
          navigate("/"); // If no products, redirect to home
          return;
        }

        setProducts(results);
      } catch {
        toast.error("Failed to fetch product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [state, navigate]);

  // Handle placing order
  const handlePlaceOrder = async () => {
    if (!customerInfo) {
      toast.error("Please select or enter shipping information!");
      return;
    }

    const { fullName, phone, address, paymentMethod } = customerInfo;
    if (!fullName || !phone || !address) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      setPlacingOrder(true);
      const loadingToast = toast.loading("Processing your order...");

      // Update product prices at checkout time
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

      // Determine order status
      // "paid" for online payment, "pending" for COD
      const status = paymentMethod === "online" ? "paid" : "pending";

      // Prepare order data
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
        status, // Add order status
        createdAt: new Date().toISOString(), // Order creation time
      };

      // Send order to server
      const response = await createOrder(orderData);
      toast.dismiss(loadingToast);
      toast.success("Order placed successfully!");

      localStorage.removeItem("checkoutItems"); // Clear previous checkout data
      navigate("/order-success", { state: { order: response }, replace: true }); // Navigate to success page
    } catch {
      toast.dismiss();
      toast.error("Failed to place the order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Return states and functions
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
