import { useState, useCallback, memo, useMemo } from "react";
import { ShoppingBag, Heart, Star, X, AlertCircle } from "lucide-react";
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

/** ======= Quantity Selector (Desktop) ======= */
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
          aria-label="Decrease quantity"
          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min={1}
          max={stock}
          aria-label="Product quantity"
          className="w-20 h-10 text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          type="button"
          label="+"
          onClick={() => handleChange(quantity + 1)}
          disabled={disabled || quantity >= stock}
          aria-label="Increase quantity"
          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
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

  /** ======= Discount ======= */
  const discountPercentage = useMemo(() => {
    if (oldPrice && oldPrice > price)
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    return 0;
  }, [oldPrice, price]);

  /** ======= Toast ======= */
  const showCartToast = useCallback(
    (imageUrl: string) => {
      try {
        toast.custom(
          (t) => (
            <div
              className={`flex items-center gap-4 p-4 max-w-sm bg-white shadow-lg rounded-xl relative transition-all ${
                t.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
              role="alert"
            >
              <img
                src={imageUrl || "/placeholder.jpg"}
                alt={title}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
                className="w-16 h-16 rounded-lg border object-cover"
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
                  item(s) to your cart
                </p>
                <p className="text-gray-700 font-medium">
                  {price.toFixed(2)} $
                </p>
                <Button
                  type="button"
                  label="View cart"
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate("/cart");
                  }}
                  className="mt-2 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg transition"
                />
              </div>
              <Button
                onClick={() => toast.dismiss(t.id)}
                icon={<X size={16} />}
                aria-label="Close notification"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
              />
            </div>
          ),
          { duration: 3000 }
        );
      } catch {
        toast.success("Added to cart successfully!");
      }
    },
    [navigate, price, quantity, title]
  );

  /** ======= Add to Cart ======= */
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

  /** ======= Favorite ======= */
  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => {
      const newState = !prev;
      toast.success(
        newState ? "Added to favorites!" : "Removed from favorites!"
      );
      return newState;
    });
  }, []);

  /** ======= Quantity (Mobile/Tablet) ======= */
  const handleMobileQuantityChange = useCallback(
    (val: number) => {
      if (val < 1) {
        setQuantity(1);
        toast.error("Minimum quantity is 1!");
      } else if (val > stock) {
        setQuantity(stock);
        toast.error(`Only ${stock} items left in stock!`);
      } else {
        setQuantity(val);
      }
    },
    [stock]
  );

  return (
    <>
      {/* ======= Main Content ======= */}
      <div
        className={`flex flex-col pb-24 md:pb-0 ${
          loading ? "pointer-events-none opacity-80" : ""
        }`}
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className="flex text-orange-400"
            role="img"
            aria-label={`Rating: ${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < rating ? "fill-current" : "fill-none stroke-current"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">(128 reviews)</span>
        </div>

        {/* Stock Alerts */}
        {isOutOfStock && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold mb-1">Out of Stock</p>
              <p className="text-sm text-gray-600">
                This item is currently unavailable. Check back soon!
              </p>
            </div>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-amber-700 font-semibold mb-1">
                Low Stock Alert
              </p>
              <p className="text-sm text-gray-600">
                Only {stock} items left! Order soon.
              </p>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6 relative overflow-hidden">
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
          <div className="text-sm text-gray-600 mt-3">
            Stock:{" "}
            <span
              className={`font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-gray-800"
              }`}
            >
              {stock}
            </span>{" "}
            item(s)
          </div>
        </div>

        {/* Quantity + Add (Desktop only) */}
        {!isOutOfStock && (
          <div className="hidden lg:block">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              stock={stock}
              disabled={loading}
            />
          </div>
        )}
        <div className="hidden lg:flex gap-3 mb-6">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            icon={<ShoppingBag className="w-5 h-5" />}
            label={
              loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </span>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Add to cart"
              )
            }
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          />
          <Button
            type="button"
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

        {/* Extra Info */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            ✅ Free shipping on orders over $50
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            ✅ 30-day return policy
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            ✅ 1-year warranty included
          </div>
        </div>
      </div>

      {/* ======= Mobile/Tablet Taskbar ======= */}
      {/* ======= Mobile/Tablet Taskbar ======= */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 p-4 safe-area-bottom">
        <div className="flex items-center gap-3">
          {/* Price Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-0.5">Product Price</div>
            <div className="text-2xl font-bold text-orange-600 leading-tight">
              {price.toFixed(2)} $
            </div>
            {oldPrice && (
              <div className="text-xs text-gray-400 line-through">
                {oldPrice.toFixed(2)} $
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1.5">
              <Button
                type="button"
                label="-"
                onClick={() => handleMobileQuantityChange(quantity - 1)}
                disabled={loading || quantity <= 1}
                className="w-8 h-8 rounded-md bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="w-9 text-center font-bold text-gray-800 text-base">
                {quantity}
              </span>
              <Button
                type="button"
                label="+"
                onClick={() => handleMobileQuantityChange(quantity + 1)}
                disabled={loading || quantity >= stock}
                className="w-8 h-8 rounded-md bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {/* 🛒 Add to Cart */}
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            icon={
              loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )
            }
            label={
              !loading && (
                <span className="ml-1.5">{isOutOfStock ? "Out" : "Add"}</span>
              )
            }
            className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3.5 rounded-xl font-semibold hover:shadow-lg active:scale-95 flex items-center justify-center gap-1 min-w-[100px] transition-all ${
              loading || isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
          {/* ❤️ Favorite */}
          <Button
            type="button"
            onClick={handleToggleFavorite}
            icon={
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            }
            aria-label="Toggle favorite"
            className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center ${
              isFavorite
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-red-400 hover:text-red-500"
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default memo(ProductInfo);
