import { Plus, Minus, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  status?: string;
  category?: string;
  images?: string[];
}

interface CartItemData {
  id: number;
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  selected: boolean;
  updating: number | null;
  updateQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
  toggleSelect: (id: number) => void;
}

export default function CartItem({
  item,
  selected,
  updating,
  updateQuantity,
  removeItem,
  toggleSelect,
}: CartItemProps) {
  const imageSrc =
    item.product?.images?.[0] || "https://via.placeholder.com/150";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  // ✅ Kiểm tra tồn kho
  const isOutOfStock =
    item.product?.status?.toLowerCase() === "outofstock" ||
    item.product?.stock === 0;

  const maxStock = item.product?.stock || 0;

  // ✅ Xử lý tăng giảm số lượng
  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (item.quantity < maxStock) {
      updateQuantity(item.id, 1);
    } else {
      toast.error("Bạn đã đạt số lượng tối đa trong kho!");
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (item.quantity > 1) {
      updateQuantity(item.id, -1);
    }
  };

  // ✅ Toggle chọn sản phẩm
  const handleToggleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      toggleSelect(item.id);
    } else {
      toast.error("Sản phẩm này đã hết hàng, không thể chọn!");
    }
  };

  return (
    <div
      className={`p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-200 border-b border-gray-100
        ${
          updating === item.id
            ? "opacity-60 cursor-wait"
            : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50"
        }
        ${selected ? "bg-orange-50 bg-opacity-50" : ""}
        ${isOutOfStock ? "opacity-70 grayscale" : ""}
      `}
    >
      {/* Checkbox chọn */}
      <Checkbox
        checked={selected}
        onChange={handleToggleSelect}
        disabled={isOutOfStock}
      />

      {/* Thông tin sản phẩm */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 shadow shrink-0">
          <img
            src={imageSrc}
            alt={item.product?.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
              {item.product?.title}
            </h3>
            {item.product?.category && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                {item.product.category}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <div className="flex items-center gap-2 text-red-600 font-semibold mt-1">
              <AlertTriangle className="w-4 h-4" />
              Out of stock
            </div>
          ) : (
            <Link
              to={`/product/${item.product?.id}`}
              className="text-orange-600 font-bold text-2xl hover:underline"
            >
              {formatPrice(item.product?.price || 0)}
            </Link>
          )}
        </div>
      </div>

      {/* Điều chỉnh số lượng */}
      <div
        className={`flex items-center gap-3 rounded-xl p-3 shadow-md ${
          isOutOfStock
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-gradient-to-br from-gray-50 to-gray-100"
        }`}
      >
        <Button
          onClick={handleDecrease}
          disabled={updating === item.id || isOutOfStock || item.quantity <= 1}
          icon={<Minus className="w-4 h-4 text-gray-700" />}
          className="bg-white hover:bg-orange-100 p-2.5 rounded-lg disabled:opacity-50"
        />

        <span className="font-bold text-gray-800 w-10 text-center text-lg select-none">
          {item.quantity}
        </span>

        <Button
          onClick={handleIncrease}
          disabled={
            updating === item.id || isOutOfStock || item.quantity >= maxStock
          }
          icon={<Plus className="w-4 h-4 text-gray-700" />}
          className="bg-white hover:bg-orange-100 p-2.5 rounded-lg disabled:opacity-50"
        />
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-sm text-gray-500 uppercase font-semibold">
          Subtotal
        </p>
        <p
          className={`font-bold text-xl ${
            isOutOfStock ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {formatPrice((item.product?.price || 0) * item.quantity)}
        </p>
      </div>

      {/* Nút xóa */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          removeItem(item.id);
        }}
        icon={<Trash2 className="w-6 h-6" />}
        className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition"
      />
    </div>
  );
}
