import { useState, useEffect, memo } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAddToCart } from "../../hooks/useAddToCart";
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

/* ========================= MAIN COMPONENT ========================= */
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
  const { handleAddToCart } = useAddToCart();

  const handleBuyNow = useBuyNowStore((state) => state.handleBuyNow);

  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const checkWishlistStatus = useWishlistStore(
    (state) => state.checkWishlistStatus
  );

  useEffect(() => {
    checkWishlistStatus(id);
  }, [id, checkWishlistStatus]);

  const firstImage = images[0] || "";

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  /* ---------- PRICE LOGIC ---------- */
  const hasSale = salePrice !== undefined && salePrice > 0;
  const hasRegular = regularPrice !== undefined && regularPrice > 0;

  // Có giảm giá hợp lệ?
  const hasDiscount = hasSale && hasRegular && salePrice! < regularPrice!;

  // Giá chính để hiển thị
  const price = hasSale ? salePrice! : hasRegular ? regularPrice! : 0;

  // Giá gạch ngang
  const oldPrice = hasDiscount ? regularPrice! : undefined;

  // Tính %
  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice! - salePrice!) / regularPrice!) * 100)
    : 0;

  const formatVND = (v: number) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const disableCart = loading || isOutOfStock || price <= 0;
  const disableBuy = isOutOfStock || price <= 0;

  return (
    <div className={`flex flex-col ${loading ? "opacity-80" : ""}`}>
      {/* TITLE + RATING */}
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

      {/* STOCK NOTICE */}
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

      {/* PRICE BOX */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6 relative overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{discountPercentage}%
          </div>
        )}

        {price > 0 ? (
          <>
            <div className="text-4xl font-bold text-orange-600">
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

      {/* QUANTITY */}
      {!isOutOfStock && (
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          stock={stock}
          disabled={loading}
        />
      )}

      {/* DESKTOP BUTTONS */}
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
          disabled={disableCart}
          icon={<ShoppingBag className="w-5 h-5" />}
          label={
            disableCart
              ? isOutOfStock
                ? "Out of Stock"
                : "No Price"
              : loading
              ? "Adding..."
              : "Add to Cart"
          }
          className={`flex-1 py-4 rounded-xl font-semibold ${
            disableCart
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        />

        <Button
          onClick={() =>
            handleBuyNow(
              { id, quantity, price, stock, image: firstImage },
              navigate
            )
          }
          disabled={disableBuy}
          icon={<CreditCard className="w-5 h-5" />}
          label={
            disableBuy
              ? isOutOfStock
                ? "Out of Stock"
                : "No Price"
              : "Buy Now"
          }
          className={`flex-1 py-4 rounded-xl font-semibold ${
            disableBuy
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        />

        <Button
          onClick={() => toggleWishlist(id)}
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
              : "border-gray-300 hover:border-red-500 hover:bg-red-50"
          }`}
        />
      </div>

      {/* PRODUCT INFO */}
      <div className="border-t pt-6 space-y-3 text-sm text-gray-600 mb-4">
        <InfoRow label="Category" value={category} />
        <InfoRow label="Brand" value={brand} />
        {sku && <InfoRow label="SKU" value={sku} />}
        {!isOutOfStock && (
          <InfoRow
            label="Availability"
            value={`${stock} in stock`}
            valueClass={isLowStock ? "text-amber-600" : "text-green-600"}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ProductInfo);

/* ========================= SMALL COMPONENTS ========================= */

const InfoRow = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}:</span>
    <span className={`font-semibold text-gray-900 ${valueClass}`}>{value}</span>
  </div>
);

/* --------------------- NOTICE --------------------- */

const colorMap = {
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "text-red-600",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "text-amber-600",
  },
};

const Notice = ({
  type,
  message,
  subMessage,
}: {
  type: "error" | "warning";
  message: string;
  subMessage: string;
}) => {
  const c = colorMap[type];

  return (
    <div
      className={`${c.bg} ${c.border} border rounded-xl p-4 mb-6 flex gap-3`}
    >
      <AlertCircle className={`w-5 h-5 ${c.icon}`} />
      <div>
        <p className={`${c.text} font-semibold`}>{message}</p>
        <p className="text-sm text-gray-600">{subMessage}</p>
      </div>
    </div>
  );
};

/* --------------------- QUANTITY SELECTOR --------------------- */

const QuantitySelector = memo(
  ({
    quantity,
    setQuantity,
    stock,
    disabled,
  }: {
    quantity: number;
    setQuantity: (v: number) => void;
    stock: number;
    disabled?: boolean;
  }) => {
    const handleChange = (v: number) => {
      if (v < 1) {
        toast.error("Minimum quantity is 1");
        return setQuantity(1);
      }
      if (v > stock) {
        toast.error(`Only ${stock} items left`);
        return setQuantity(stock);
      }
      setQuantity(v);
    };

    return (
      <div className="flex items-center gap-2 mb-6">
        <Button
          label="-"
          onClick={() => handleChange(quantity - 1)}
          disabled={disabled || quantity <= 1}
          className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500"
        />

        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(Number(e.target.value) || 1)}
          min={1}
          max={stock}
          disabled={disabled}
          className="w-20 h-10 text-center font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />

        <Button
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
