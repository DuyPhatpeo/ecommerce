import { useState, useEffect, memo, useCallback } from "react";
import {
  FiShoppingBag,
  FiHeart,
  FiStar,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useCartStore } from "../../stores/cartStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { useBuyNowStore } from "../../stores/buyNowStore";

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
  const navigate = useNavigate();

  const handleAddToCart = useCartStore((state) => state.addItemToCart);
  const handleBuyNow = useBuyNowStore((state) => state.handleBuyNow);

  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const checkWishlistStatus = useWishlistStore(
    (state) => state.checkWishlistStatus
  );
  const wishlistLoading = useWishlistStore((state) => state.loading[id]);

  useEffect(() => {
    checkWishlistStatus(id);
  }, [id, checkWishlistStatus]);

  const firstImage = images[0] || "";
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const hasSale = salePrice !== undefined && salePrice > 0;
  const hasRegular = regularPrice !== undefined && regularPrice > 0;
  const hasDiscount = hasSale && hasRegular && salePrice! < regularPrice!;
  const price = hasSale ? salePrice! : hasRegular ? regularPrice! : 0;
  const oldPrice = hasDiscount ? regularPrice! : undefined;
  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice! - salePrice!) / regularPrice!) * 100)
    : 0;

  const formatVND = (val: number) =>
    val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const disableCart = loading || isOutOfStock || price <= 0;
  const disableBuy = isOutOfStock || price <= 0;

  const handleAdd = useCallback(async () => {
    if (disableCart) return;
    setLoading(true);
    try {
      await handleAddToCart({
        id,
        title,
        stock,
        quantity,
        price,
        images,
        navigate,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }, [
    disableCart,
    handleAddToCart,
    id,
    title,
    stock,
    quantity,
    price,
    images,
    navigate,
  ]);

  const handleBuy = useCallback(() => {
    if (disableBuy) return;
    handleBuyNow({ id, quantity, price, stock, image: firstImage }, navigate);
  }, [
    disableBuy,
    handleBuyNow,
    id,
    quantity,
    price,
    stock,
    firstImage,
    navigate,
  ]);

  const handleToggleWishlist = useCallback(() => {
    if (!wishlistLoading) toggleWishlist(id);
  }, [toggleWishlist, id, wishlistLoading]);

  return (
    <div className={`flex flex-col ${loading ? "opacity-80" : ""}`}>
      {/* Title & Rating */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: 5 }, (_, i) => (
          <FiStar
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "fill-current text-orange-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-gray-600">(128 reviews)</span>
      </div>

      {/* Stock Notice */}
      {isOutOfStock && (
        <Notice
          type="error"
          message="Out of Stock"
          subMessage="This item is currently unavailable."
        />
      )}
      {!isOutOfStock && isLowStock && (
        <Notice
          type="warning"
          message="Low Stock"
          subMessage={`Only ${stock} left! Order soon.`}
        />
      )}

      {/* Price */}
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

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          stock={stock}
          disabled={loading}
        />
      )}

      {/* Buttons Desktop */}
      <div className="hidden lg:flex gap-3 mb-6 items-center">
        <Button
          onClick={handleAdd}
          disabled={disableCart}
          icon={<FiShoppingBag className="w-5 h-5" />}
          label={
            disableCart
              ? isOutOfStock
                ? "Out of Stock"
                : "No Price"
              : loading
              ? "Adding..."
              : "Add to Cart"
          }
          className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
            disableCart
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        />
        <Button
          onClick={handleBuy}
          disabled={disableBuy}
          icon={<FiCreditCard className="w-5 h-5" />}
          label={
            disableBuy
              ? isOutOfStock
                ? "Out of Stock"
                : "No Price"
              : "Buy Now"
          }
          className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
            disableBuy
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        />
        <Button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          icon={
            <FiHeart
              className={`w-6 h-6 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          }
          className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-all ${
            isWishlisted
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
          } ${wishlistLoading ? "opacity-50 cursor-wait" : ""}`}
        />
      </div>

      {/* Mobile Taskbar */}
      {!isOutOfStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  label="-"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 border border-gray-300 rounded-md text-sm font-semibold hover:border-orange-500 hover:text-orange-500"
                />
                <span className="w-8 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <Button
                  type="button"
                  label="+"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  className="w-7 h-7 border border-gray-300 rounded-md text-sm font-semibold hover:border-orange-500 hover:text-orange-500"
                />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-base font-bold text-orange-600">
                  {formatVND(price * quantity)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                disabled={disableCart}
                icon={<FiShoppingBag className="w-4 h-4" />}
                label={
                  disableCart ? "No Price" : loading ? "Adding..." : "Cart"
                }
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 ${
                  disableCart
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 text-white active:bg-orange-700"
                }`}
              />
              <Button
                onClick={handleBuy}
                disabled={disableBuy}
                icon={<FiCreditCard className="w-4 h-4" />}
                label={disableBuy ? "No Price" : "Buy Now"}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 ${
                  disableBuy
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white active:bg-gray-800"
                }`}
              />
              <Button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                icon={
                  <FiHeart
                    className={`w-4 h-4 transition-colors ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                }
                className={`w-11 h-11 border rounded-lg flex items-center justify-center ${
                  isWishlisted
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 active:border-red-500 active:bg-red-50"
                } ${wishlistLoading ? "opacity-50 cursor-wait" : ""}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Info */}
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

      <div className="lg:hidden h-28" />
    </div>
  );
};

export default memo(ProductInfo);

/* ------------------- Notice Component ------------------- */
const Notice = ({
  type,
  message,
  subMessage,
}: {
  type: "error" | "warning";
  message: string;
  subMessage: string;
}) => {
  const color = type === "error" ? "red" : "amber";
  return (
    <div
      className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4 mb-6 flex items-start gap-3`}
    >
      <FiAlertCircle className={`w-5 h-5 text-${color}-600 flex-shrink-0`} />
      <div>
        <p className={`text-${color}-700 font-semibold mb-1`}>{message}</p>
        <p className="text-sm text-gray-600">{subMessage}</p>
      </div>
    </div>
  );
};

/* ------------------- QuantitySelector ------------------- */
const QuantitySelector = memo(
  ({
    quantity,
    setQuantity,
    stock,
    disabled,
  }: {
    quantity: number;
    setQuantity: (val: number) => void;
    stock: number;
    disabled?: boolean;
  }) => {
    const handleChange = (val: number) => {
      if (val < 1) {
        toast.error("Minimum quantity is 1!");
        return setQuantity(1);
      }
      if (val > stock) {
        toast.error(`Only ${stock} items left!`);
        return setQuantity(stock);
      }
      setQuantity(val);
    };
    return (
      <div className="flex items-center gap-2 mb-6">
        <Button
          type="button"
          label="-"
          onClick={() => handleChange(quantity - 1)}
          disabled={disabled || quantity <= 1}
          className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500"
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          min={1}
          max={stock}
          disabled={disabled}
          className="w-20 h-10 text-center font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
        <Button
          type="button"
          label="+"
          onClick={() => handleChange(quantity + 1)}
          disabled={disabled || quantity >= stock}
          className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500"
        />
      </div>
    );
  }
);
QuantitySelector.displayName = "QuantitySelector";
