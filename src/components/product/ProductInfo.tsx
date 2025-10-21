import { useState, useCallback, memo, useMemo } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  X,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ProductInfoProps {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand: string;
  rating?: number;
  images: string[];
  stock: number;
  sku?: string;
}

/** Quantity Selector */
const QuantitySelector = memo(
  ({
    quantity,
    setQuantity,
    stock,
    disabled = false,
  }: {
    quantity: number;
    setQuantity: (val: number) => void;
    stock: number;
    disabled?: boolean;
  }) => {
    const handleChange = (val: number) => {
      if (val < 1) {
        setQuantity(1);
        toast.error("Minimum quantity is 1!");
      } else if (val > stock) {
        setQuantity(stock);
        toast.error(`Only ${stock} items left in stock!`);
      } else {
        setQuantity(val);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleChange(quantity + 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleChange(quantity - 1);
      }
    };

    return (
      <div className="mb-6 flex items-center gap-3">
        <Button
          type="button"
          label="-"
          onClick={() => handleChange(quantity - 1)}
          disabled={disabled || quantity <= 1}
          className="w-10 h-10 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 rounded-lg font-semibold"
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min={1}
          max={stock}
          className="w-20 h-10 text-center font-semibold"
        />
        <Button
          type="button"
          label="+"
          onClick={() => handleChange(quantity + 1)}
          disabled={disabled || quantity >= stock}
          className="w-10 h-10 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 rounded-lg font-semibold"
        />
      </div>
    );
  }
);

const ProductInfo = ({
  id,
  title,
  price,
  oldPrice,
  category,
  brand,
  rating = 5,
  images,
  stock,
  sku,
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  /** Discount */
  const discountPercentage = useMemo(() => {
    if (oldPrice && oldPrice > price)
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    return 0;
  }, [oldPrice, price]);

  /** Custom Toast */
  const showCartToast = useCallback(
    (imageUrl: string) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-4 p-4 max-w-sm bg-white shadow-lg rounded-xl relative transition-all ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            <img
              src={imageUrl || "/placeholder.jpg"}
              alt={title}
              className="w-16 h-16 rounded-lg border object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-gray-800 line-clamp-1">
                {title}
              </p>
              <p className="text-gray-600">
                Added{" "}
                <span className="text-orange-500 font-semibold">
                  {quantity}
                </span>{" "}
                item(s)
              </p>
              <p className="text-gray-700 font-medium">{price.toFixed(2)} $</p>
              <Button
                label="View cart"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/cart");
                }}
                className="mt-2 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg"
              />
            </div>
            <Button
              onClick={() => toast.dismiss(t.id)}
              icon={<X size={16} />}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            />
          </div>
        ),
        { duration: 3000 }
      );
    },
    [navigate, price, quantity, title]
  );

  /** Add to Cart */
  const handleAddToCart = useCallback(async () => {
    if (loading || isOutOfStock) return;
    if (quantity > stock) {
      toast.error(`Only ${stock} items left in stock!`);
      return;
    }

    setLoading(true);
    try {
      await addToCart(id, quantity);
      showCartToast(images?.[0]);
    } catch {
      toast.error("Failed to add product to cart!");
    } finally {
      setLoading(false);
    }
  }, [id, quantity, stock, images, loading, showCartToast, isOutOfStock]);

  /** ✅ Buy Now (Fixed) */
  const handleBuyNow = useCallback(() => {
    if (isOutOfStock) {
      toast.error("This product is out of stock!");
      return;
    }

    const subtotal = price * quantity;
    const tax = subtotal * 0.1;
    const shipping = 30000;
    const total = subtotal + tax + shipping;

    navigate("/checkout", {
      state: {
        productId: id, // ✅ đúng key cho mua trực tiếp
        quantity,
        subtotal,
        tax,
        shipping,
        total,
      },
    });

    toast.success("🧾 Redirecting to checkout...");
  }, [id, price, quantity, isOutOfStock, navigate]);

  /** Favorite */
  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => {
      const newState = !prev;
      toast.success(
        newState ? "Added to favorites!" : "Removed from favorites!"
      );
      return newState;
    });
  }, []);

  return (
    <>
      <div
        className={`flex flex-col pb-24 md:pb-0 ${loading ? "opacity-80" : ""}`}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? "fill-current text-orange-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-gray-600">(128 reviews)</span>
        </div>

        {/* Stock notice */}
        {isOutOfStock && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold mb-1">Out of Stock</p>
              <p className="text-sm text-gray-600">
                This item is currently unavailable.
              </p>
            </div>
          </div>
        )}

        {!isOutOfStock && isLowStock && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-amber-700 font-semibold mb-1">Low Stock</p>
              <p className="text-sm text-gray-600">
                Only {stock} left! Order soon.
              </p>
            </div>
          </div>
        )}

        {/* Price box */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6 relative">
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}
          <div className="text-4xl font-bold text-orange-600 mb-1">
            {price.toFixed(2)} $
          </div>
          {oldPrice && (
            <div className="text-gray-500 line-through text-lg">
              {oldPrice.toFixed(2)} $
            </div>
          )}
        </div>

        {!isOutOfStock && (
          <div className="hidden lg:block">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              stock={stock}
            />
          </div>
        )}

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-3 mb-6">
          <Button
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            icon={<ShoppingBag className="w-5 h-5" />}
            label={loading ? "Adding..." : "Add to cart"}
            className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all"
          />
          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            icon={<CreditCard className="w-5 h-5" />}
            label="Buy Now"
            className="flex-1 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 hover:scale-105 transition-all"
          />
          <Button
            onClick={handleToggleFavorite}
            icon={
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            }
            className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center ${
              isFavorite
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-red-500 hover:text-red-500"
            }`}
          />
        </div>

        {/* Info */}
        <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="font-semibold text-gray-900">{category}</span>
          </div>
          <div className="flex justify-between">
            <span>Brand:</span>
            <span className="font-semibold text-gray-900">{brand}</span>
          </div>
          {sku && (
            <div className="flex justify-between">
              <span>SKU:</span>
              <span className="font-semibold text-gray-900">{sku}</span>
            </div>
          )}
        </div>
      </div>

      <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 border-t border-orange-100">
        <div className="flex items-center justify-between gap-3 p-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="text-xl text-gray-700 hover:text-orange-500 disabled:opacity-50"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(Math.max(1, parseInt(e.target.value) || 1), stock)
                )
              }
              className="w-10 text-center font-semibold text-gray-700 border-none outline-none bg-transparent"
            />
            <button
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              className="text-xl text-gray-700 hover:text-orange-500 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-1">
            <Button
              onClick={handleAddToCart}
              disabled={loading || isOutOfStock}
              label={
                <div className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-sm">
                    {loading ? "Adding..." : "Add"}
                  </span>
                </div>
              }
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 active:scale-95 transition-all"
            />
            <Button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              label={
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">Buy</span>
                </div>
              }
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductInfo);
