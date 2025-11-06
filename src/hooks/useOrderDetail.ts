import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrderById } from "../api/orderApi";
import { getProductById } from "../api/productApi";

/* ------------------ Interfaces ------------------ */
interface Customer {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  note?: string;
  paymentMethod?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Product {
  id: string;
  title: string;
  images?: string[];
}

export interface OrderDetail {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  status?: string;
  createdAt: string;
}

/* ------------------ Hook ------------------ */
export const useOrderDetail = (id: string | undefined) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [products, setProducts] = useState<
    {
      id: string;
      title: string;
      image?: string;
      price: number;
      quantity: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        // ✅ Firebase trả object trực tiếp, không có .data
        const orderData = await getOrderById(id);

        if (!orderData) {
          toast.error("Order not found!");
          return;
        }

        setOrder(orderData);

        // ✅ Load chi tiết sản phẩm
        const productDetails = await Promise.all(
          (orderData.items || []).map(async (item: OrderItem) => {
            try {
              const product = await getProductById(item.productId);
              return {
                id: item.productId,
                title: product.title,
                image:
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : "/placeholder.png",
                price: item.price,
                quantity: item.quantity,
              };
            } catch {
              return {
                id: item.productId,
                title: "Product not found",
                image: "/placeholder.png",
                price: item.price,
                quantity: item.quantity,
              };
            }
          })
        );

        setProducts(productDetails);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order details!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  return { order, products, loading };
};
