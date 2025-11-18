import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductItem {
  id: string;
  title: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Props {
  item: ProductItem;
}

const OrderProductItem: React.FC<Props> = ({ item }) => {
  const navigate = useNavigate();
  const total = item.price * item.quantity;

  const handleClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0 cursor-pointer"
    >
      {/* Ảnh */}
      <img
        src={item.image || "/placeholder.png"}
        alt={item.title}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
      />

      {/* Tên + số lượng */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate hover:text-orange-500">
          {item.title}
        </p>
        <p className="text-xs text-gray-500">x{item.quantity}</p>
      </div>

      {/* Giá */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-bold text-orange-600 mt-0.5">
          {total.toLocaleString("vi-VN")}₫
        </p>
      </div>
    </div>
  );
};

export default OrderProductItem;
