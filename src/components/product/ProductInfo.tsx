import { useState, useCallback, memo, useMemo } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useBuyNow } from "../../hooks/useBuyNow";
import { useWishlist } from "../../hooks/useWishlist";

/* ------------------- Types ------------------- */
interface ProductInfoProps {
  id: number;
  title: string;
  salePrice?: number;
  regularPrice?: number;
  category: string;
  brand: string;
  rating?: number;
  images: string[];
  stock: number;
  sku?: string;
}

/* ------------------- Quantity Selector ------------------- */
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

/* ------------------- Product Info ------------------- */
const ProductInfo = ({
  id,
  title,
  salePrice,
  regularPrice,
  category,
  brand,
  rating = 5,
  images,
  stock,
  sku,
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { handleAddToCart } = useAddToCart();
  const { handleBuyNow } = useBuyNow();

  const firstImage = images?.[0] || "";

  // ✅ Ưu tiên salePrice, fallback sang regularPrice
  const effectivePrice = salePrice ?? regularPrice ?? 0;

  // ✅ Wishlist Hook (ảnh đầu tiên)
  const { isWishlisted, handleToggleWishlist } = useWishlist({
    id,
    title,
    img: firstImage,
    price: effectivePrice,
  });

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // ✅ Tính % giảm giá
  const discountPercentage = useMemo(() => {
    if (regularPrice && salePrice && regularPrice > salePrice)
      return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    return 0;
  }, [regularPrice, salePrice]);

  const formatVND = (val: number) =>
    val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  /* ------------------- UI ------------------- */
  return (
    <div
      className={`flex flex-col pb-24 md:pb-0 ${loading ? "opacity-80" : ""}`}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

      {/* ⭐ Rating */}
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

      {/* ⚠️ Stock Notice */}
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

      {/* 💰 Price */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6 relative">
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}

        {effectivePrice > 0 ? (
          <>
            <div className="text-4xl font-bold text-orange-600 mb-1">
              {formatVND(effectivePrice)}
            </div>
            {regularPrice && salePrice && regularPrice > salePrice && (
              <div className="text-gray-500 line-through text-lg">
                {formatVND(regularPrice)}
              </div>
            )}
          </>
        ) : (
          <div className="text-lg font-semibold text-gray-600">
            Contact for price
          </div>
        )}
      </div>

      {/* 🔢 Quantity */}
      {!isOutOfStock && (
        <div className="hidden lg:block">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            stock={stock}
          />
        </div>
      )}

      {/* 🛒 Buttons */}
      <div className="flex gap-3 mb-6 items-center">
        <div className="hidden lg:flex flex-1 gap-3">
          <Button
            onClick={() =>
              handleAddToCart({
                id,
                title,
                stock,
                quantity,
                price: effectivePrice,
                images,
                setLoading,
              })
            }
            disabled={loading || isOutOfStock || effectivePrice <= 0}
            icon={<ShoppingBag className="w-5 h-5" />}
            label={
              isOutOfStock
                ? "Out of Stock"
                : effectivePrice <= 0
                ? "No Price"
                : loading
                ? "Adding..."
                : "Add to Cart"
            }
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              isOutOfStock || effectivePrice <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-600 text-white hover:scale-105"
            }`}
          />

          <Button
            onClick={() =>
              handleBuyNow({
                id,
                quantity,
                price: effectivePrice,
                stock,
                image: firstImage,
              })
            }
            disabled={isOutOfStock || effectivePrice <= 0}
            icon={<CreditCard className="w-5 h-5" />}
            label={
              isOutOfStock
                ? "Out of Stock"
                : effectivePrice <= 0
                ? "No Price"
                : "Buy Now"
            }
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              isOutOfStock || effectivePrice <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 hover:scale-105"
            }`}
          />
        </div>

        {/* ❤️ Wishlist */}
        <Button
          onClick={handleToggleWishlist}
          icon={
            <Heart
              className={`w-6 h-6 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          }
          className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center ${
            isWishlisted
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-red-500 hover:text-red-500"
          }`}
        />
      </div>

      {/* ℹ️ Info */}
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
  );
};

export default memo(ProductInfo);
