import { useState, memo } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useBuyNow } from "../../hooks/useBuyNow";
import { useWishlist } from "../../hooks/useWishlist";

/* ------------------- Types ------------------- */
interface ProductInfoProps {
  id: string;
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

interface BuyNowPayload {
  id: string;
  quantity: number;
  price: number;
  stock: number;
  image?: string;
}

/* ------------------- Quantity Selector ------------------- */
const QuantitySelector = memo(
  ({
    quantity,
    setQuantity,
    stock,
    disabled = false,
    isMobile = false,
  }: {
    quantity: number;
    setQuantity: (val: number) => void;
    stock: number;
    disabled?: boolean;
    isMobile?: boolean;
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
      <div
        className={`flex items-center gap-2 ${
          isMobile ? "justify-center" : ""
        }`}
      >
        {isMobile && (
          <span className="text-sm font-medium text-gray-700 mr-2">Qty:</span>
        )}
        <Button
          type="button"
          label="-"
          onClick={() => handleChange(quantity - 1)}
          disabled={disabled || quantity <= 1}
          className={`${
            isMobile ? "w-8 h-8" : "w-10 h-10"
          } border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 active:border-orange-500 active:text-orange-500 disabled:opacity-50 rounded-lg font-semibold transition-colors`}
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min={1}
          max={stock}
          className={`${
            isMobile ? "w-14 h-8" : "w-20 h-10"
          } text-center font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
        />
        <Button
          type="button"
          label="+"
          onClick={() => handleChange(quantity + 1)}
          disabled={disabled || quantity >= stock}
          className={`${
            isMobile ? "w-8 h-8" : "w-10 h-10"
          } border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 active:border-orange-500 active:text-orange-500 disabled:opacity-50 rounded-lg font-semibold transition-colors`}
        />
        {isMobile && (
          <span className="text-sm text-gray-500 ml-2">/ {stock}</span>
        )}
      </div>
    );
  }
);

QuantitySelector.displayName = "QuantitySelector";

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
  const { isWishlisted, handleToggleWishlist } = useWishlist(id);

  const firstImage = images?.[0] || "";
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  /* ✅ Chuẩn hóa logic giá và giảm giá */
  const hasDiscount =
    salePrice && regularPrice && salePrice < regularPrice ? true : false;
  const price = hasDiscount ? salePrice! : regularPrice ?? 0;
  const oldPrice = hasDiscount ? regularPrice : undefined;
  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice! - price) / oldPrice!) * 100)
    : 0;

  const formatVND = (val: number) =>
    val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  /* ------------------- UI ------------------- */
  return (
    <div className={`flex flex-col ${loading ? "opacity-80" : ""}`}>
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
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
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
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-amber-700 font-semibold mb-1">Low Stock</p>
            <p className="text-sm text-gray-600">
              Only {stock} left! Order soon.
            </p>
          </div>
        </div>
      )}

      {/* 💰 Price */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6 relative overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{discountPercentage}%
          </div>
        )}

        {price > 0 ? (
          <>
            <div className="text-4xl font-bold text-orange-600 mb-1">
              {formatVND(price)}
            </div>
            {oldPrice && (
              <div className="text-gray-500 line-through text-lg">
                {formatVND(oldPrice)}
              </div>
            )}
          </>
        ) : (
          <div className="text-lg font-semibold text-gray-600">
            Contact for price
          </div>
        )}
      </div>

      {/* 🔢 Quantity - Desktop Only */}
      {!isOutOfStock && (
        <div className="hidden lg:block mb-6">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            stock={stock}
            disabled={loading}
          />
        </div>
      )}

      {/* 🛒 Buttons - Desktop Only */}
      <div className="hidden lg:flex gap-3 mb-6 items-center">
        <Button
          onClick={() =>
            handleAddToCart({
              id,
              title,
              stock,
              quantity,
              price,
              images,
              setLoading,
            })
          }
          disabled={loading || isOutOfStock || price <= 0}
          icon={<ShoppingBag className="w-5 h-5" />}
          label={
            isOutOfStock
              ? "Out of Stock"
              : price <= 0
              ? "No Price"
              : loading
              ? "Adding..."
              : "Add to Cart"
          }
          className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
            isOutOfStock || price <= 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 active:scale-100"
          }`}
        />

        <Button
          onClick={() =>
            handleBuyNow({
              id,
              quantity,
              price,
              stock,
              image: firstImage,
            } as BuyNowPayload)
          }
          disabled={isOutOfStock || price <= 0}
          icon={<CreditCard className="w-5 h-5" />}
          label={
            isOutOfStock ? "Out of Stock" : price <= 0 ? "No Price" : "Buy Now"
          }
          className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
            isOutOfStock || price <= 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-100"
          }`}
        />

        {/* ❤️ Wishlist - Desktop */}
        <Button
          onClick={handleToggleWishlist}
          icon={
            <Heart
              className={`w-6 h-6 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          }
          className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-all ${
            isWishlisted
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
          }`}
        />
      </div>

      {/* 🛒 Mobile/Tablet Taskbar */}
      {!isOutOfStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-3 py-2">
            {/* Quantity & Total Price */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Qty:</span>
                <Button
                  type="button"
                  label="-"
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  disabled={loading || quantity <= 1}
                  className="w-7 h-7 border border-gray-300 hover:border-orange-500 hover:text-orange-500 active:border-orange-500 active:text-orange-500 disabled:opacity-50 rounded-md font-semibold text-sm"
                />
                <span className="w-8 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <Button
                  type="button"
                  label="+"
                  onClick={() =>
                    setQuantity((q) =>
                      q >= stock
                        ? (toast.error(`Only ${stock} items left!`), stock)
                        : q + 1
                    )
                  }
                  disabled={loading || quantity >= stock}
                  className="w-7 h-7 border border-gray-300 hover:border-orange-500 hover:text-orange-500 active:border-orange-500 active:text-orange-500 disabled:opacity-50 rounded-md font-semibold text-sm"
                />
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-base font-bold text-orange-600">
                  {formatVND(price * quantity)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleAddToCart({
                    id,
                    title,
                    stock,
                    quantity,
                    price,
                    images,
                    setLoading,
                  })
                }
                disabled={loading || price <= 0}
                icon={<ShoppingBag className="w-4 h-4" />}
                label={price <= 0 ? "No Price" : loading ? "Adding..." : "Cart"}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                  price <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 text-white active:bg-orange-700 active:scale-95"
                }`}
              />

              <Button
                onClick={() =>
                  handleBuyNow({
                    id,
                    quantity,
                    price,
                    stock,
                    image: firstImage,
                  } as BuyNowPayload)
                }
                disabled={price <= 0}
                icon={<CreditCard className="w-4 h-4" />}
                label={price <= 0 ? "No Price" : "Buy Now"}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                  price <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white active:bg-gray-800 active:scale-95"
                }`}
              />

              {/* Wishlist */}
              <Button
                onClick={handleToggleWishlist}
                icon={
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                }
                className={`w-11 h-11 border rounded-lg flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 active:border-red-500 active:bg-red-50"
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ℹ️ Product Info */}
      <div className="border-t pt-6 space-y-3 text-sm text-gray-600 mb-4 lg:mb-0">
        <div className="flex justify-between">
          <span className="text-gray-500">Category:</span>
          <span className="font-semibold text-gray-900">{category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Brand:</span>
          <span className="font-semibold text-gray-900">{brand}</span>
        </div>
        {sku && (
          <div className="flex justify-between">
            <span className="text-gray-500">SKU:</span>
            <span className="font-semibold text-gray-900">{sku}</span>
          </div>
        )}
        {!isOutOfStock && (
          <div className="flex justify-between">
            <span className="text-gray-500">Availability:</span>
            <span
              className={`font-semibold ${
                isLowStock ? "text-amber-600" : "text-green-600"
              }`}
            >
              {stock} in stock
            </span>
          </div>
        )}
      </div>

      {/* Spacer for mobile taskbar */}
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default memo(ProductInfo);
