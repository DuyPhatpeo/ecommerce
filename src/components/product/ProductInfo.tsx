import { useState, useCallback, memo } from "react";
import { ShoppingBag, Heart, Star, X } from "lucide-react";
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
}

/** ======= Quantity Selector ======= */
const QuantitySelector = memo(
  ({
    quantity,
    setQuantity,
    stock,
  }: {
    quantity: number;
    setQuantity: (val: number) => void;
    stock: number;
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

    return (
      <div className="mb-6 flex items-center gap-3">
        <Button
          type="button"
          label="-"
          onClick={() => handleChange(quantity - 1)}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 font-semibold"
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          className="w-20 h-10 text-center font-semibold"
        />
        <Button
          type="button"
          label="+"
          onClick={() => handleChange(quantity + 1)}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 font-semibold"
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
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /** ======= Compact & Reusable Toast ======= */
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
              <p className="text-gray-700 font-medium">{price.toFixed(2)} $</p>

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
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            />
          </div>
        ),
        { duration: 3000 }
      );
    },
    [navigate, price, quantity, title]
  );

  /** ======= Handle Add to Cart ======= */
  const handleAddToCart = useCallback(async () => {
    if (loading) return;
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
  }, [id, quantity, stock, images, loading, showCartToast]);

  /** ======= Handle Quantity for Mobile ======= */
  const handleMobileQuantityChange = (val: number) => {
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

  return (
    <>
      <div
        className={`flex flex-col pb-24 md:pb-0 ${
          loading ? "pointer-events-none opacity-80" : ""
        }`}
      >
        {/* ======= Title ======= */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>

        {/* ======= Rating ======= */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex text-orange-400">
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="text-gray-600">(128 reviews)</span>
        </div>

        {/* ======= Price ======= */}
        <div className="bg-orange-50 rounded-xl p-6 mb-6">
          <div className="text-4xl font-bold text-orange-600 mb-1">
            {price.toFixed(2)} $
          </div>
          {oldPrice && (
            <div className="text-gray-500 line-through">
              {oldPrice.toFixed(2)} $
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2">
            Stock: <span className="font-semibold text-gray-800">{stock}</span>{" "}
            item(s) left
          </div>
        </div>

        {/* ======= Quantity (Desktop only) ======= */}
        <div className="hidden md:block">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            stock={stock}
          />
        </div>

        {/* ======= Add to cart (Desktop only) ======= */}
        <div className="hidden md:flex gap-3 mb-6">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            icon={<ShoppingBag className="w-5 h-5" />}
            label={
              loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </span>
              ) : (
                "Add to cart"
              )
            }
            className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
          <Button
            type="button"
            icon={<Heart className="w-6 h-6" />}
            className="w-14 h-14 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:text-red-500 flex items-center justify-center"
          />
        </div>

        {/* ======= Info ======= */}
        <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="font-semibold">{category}</span>
          </div>

          <div className="flex justify-between">
            <span>Brand:</span>
            <span className="font-semibold">{brand}</span>
          </div>
        </div>
      </div>

      {/* ======= Mobile Taskbar (Sticky Bottom) ======= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 p-4 safe-area-bottom">
        <div className="flex items-center gap-3">
          {/* Price Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-0.5">Product Price</div>
            <div className="text-2xl font-bold text-orange-600 leading-tight">
              {price.toFixed(2)} $
            </div>
          </div>

          {/* Quantity Selector - Compact */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1.5">
            <Button
              type="button"
              label="-"
              onClick={() => handleMobileQuantityChange(quantity - 1)}
              disabled={loading}
              className="w-8 h-8 rounded-md bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 active:bg-orange-50 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <span className="w-9 text-center font-bold text-gray-800 text-base">
              {quantity}
            </span>
            <Button
              type="button"
              label="+"
              onClick={() => handleMobileQuantityChange(quantity + 1)}
              disabled={loading}
              className="w-8 h-8 rounded-md bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 active:bg-orange-50 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          {/* Add to Cart Button */}
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            icon={
              loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )
            }
            label={!loading && <span className="ml-1.5">Add</span>}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3.5 rounded-xl font-semibold hover:shadow-lg active:scale-95 flex items-center justify-center gap-1 min-w-[100px] transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default memo(ProductInfo);
