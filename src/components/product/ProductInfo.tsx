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
        toast.error("❌ Số lượng tối thiểu là 1!");
      } else if (val > stock) {
        setQuantity(stock);
        toast.error(`⚠️ Chỉ còn ${stock} sản phẩm trong kho!`);
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

  /** ======= Toast gọn gàng & tái sử dụng ======= */
  const showCartToast = useCallback(
    (imageUrl: string) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-4 p-4 max-w-sm bg-white shadow-lg rounded-xl border relative transition-all ${
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
                Đã thêm{" "}
                <span className="text-orange-500 font-semibold">
                  {quantity}
                </span>{" "}
                sản phẩm vào giỏ hàng
              </p>
              <p className="text-gray-700 font-medium">{price.toFixed(2)} $</p>

              <Button
                type="button"
                label="Xem giỏ hàng"
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

  /** ======= Xử lý thêm giỏ hàng ======= */
  const handleAddToCart = useCallback(async () => {
    if (loading) return;
    if (quantity > stock) {
      toast.error(`Chỉ còn ${stock} sản phẩm trong kho!`);
      return;
    }

    setLoading(true);
    try {
      await addToCart(id, quantity);
      showCartToast(images?.[0]);
    } catch {
      toast.error("❌ Không thể thêm sản phẩm vào giỏ hàng!");
    } finally {
      setLoading(false);
    }
  }, [id, quantity, stock, images, loading, showCartToast]);

  return (
    <div
      className={`flex flex-col ${
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
          <div className="text-gray-500 line-through">{oldPrice} $</div>
        )}
        <div className="text-sm text-gray-500 mt-2">
          Còn lại: <span className="font-semibold text-gray-800">{stock}</span>{" "}
          sản phẩm
        </div>
      </div>

      {/* ======= Quantity ======= */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        stock={stock}
      />

      {/* ======= Add to cart ======= */}
      <div className="flex gap-3 mb-6">
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          icon={<ShoppingBag className="w-5 h-5" />}
          label={
            loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang thêm...
              </span>
            ) : (
              "Thêm vào giỏ hàng"
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
  );
};

export default memo(ProductInfo);
