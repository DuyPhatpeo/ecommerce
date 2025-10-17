import { Package, CreditCard, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductType {
  id: number;
  title: string;
  price: number;
  stock: number;
}

interface CartItemType {
  id: number; // cart item id
  productId: number;
  quantity: number;
  product: ProductType;
}

interface CartSummaryProps {
  cartItems: CartItemType[];
  selectedItems: number[];
}

export default function CartSummary({
  cartItems,
  selectedItems,
}: CartSummaryProps) {
  const navigate = useNavigate();

  // Lọc sản phẩm hợp lệ
  const validSelectedItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.product.stock > 0 &&
      item.quantity <= item.product.stock
  );

  // Tính subtotal
  const subtotal = validSelectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = validSelectedItems.length > 0 ? (subtotal >= 25 ? 0 : 1) : 0;
  const total = subtotal + tax + shipping;

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Checkout
  const handleCheckout = () => {
    if (validSelectedItems.length === 0) return;

    const checkoutItems = validSelectedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));

    navigate("/checkout", {
      state: {
        subtotal,
        tax,
        shipping,
        total,
        selectedItems: checkoutItems, // chỉ id + quantity
      },
    });
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-b-3xl shadow-2xl p-6 sticky top-20">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-2 rounded-xl">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Subtotal
            </span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-semibold">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-semibold">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
          {subtotal > 0 && subtotal < 25 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-800">
                Add <strong>{formatPrice(25 - subtotal)}</strong> more to get
                free shipping!
              </p>
            </div>
          )}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold">Total</span>
            <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {formatPrice(total)}
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={validSelectedItems.length === 0}
          className={`w-full font-bold text-lg py-5 rounded-2xl transition-all flex justify-center items-center gap-2 ${
            validSelectedItems.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
          }`}
        >
          <CreditCard className="w-6 h-6" />
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
