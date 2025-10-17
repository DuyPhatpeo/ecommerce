import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";
import { getProductById } from "../../api/productApi";

interface CheckoutItem {
  id: number;
  quantity: number;
}

interface CheckoutState {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  selectedItems: CheckoutItem[];
}

interface CartProduct {
  cartItem: CheckoutItem;
  product: any;
}

const MainCheckOut: React.FC = () => {
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  useEffect(() => {
    const selectedItems: CheckoutItem[] =
      state?.selectedItems ||
      JSON.parse(localStorage.getItem("checkoutItems") || "[]");

    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          selectedItems.map(async (item) => {
            const cartItem = await getCartItem(item.id);
            const product = await getProductById(cartItem.productId);
            return {
              cartItem: { id: cartItem.id, quantity: cartItem.quantity },
              product,
            };
          })
        );

        setCartProducts(results);
        console.log("Cart Products for Checkout:", results);
      } catch (err) {
        console.error("Error fetching checkout data:", err);
      }
    };

    if (selectedItems.length > 0) fetchProducts();
  }, [state]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cartProducts.map(({ cartItem, product }) => (
        <div
          key={cartItem.id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <h2 className="font-semibold">{product.title}</h2>
            <p>Quantity: {cartItem.quantity}</p>
          </div>
          <div className="font-bold">
            ${(product.price * cartItem.quantity).toFixed(2)}
          </div>
        </div>
      ))}

      <div className="mt-6 text-right">
        <p>Subtotal: ${state?.subtotal.toFixed(2)}</p>
        <p>Tax: ${state?.tax.toFixed(2)}</p>
        <p>Shipping: ${state?.shipping.toFixed(2)}</p>
        <p className="text-xl font-bold">Total: ${state?.total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MainCheckOut;
