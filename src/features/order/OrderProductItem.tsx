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
      className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0 cursor-pointer transition hover:bg-orange-50 rounded-lg px-2"
    >
      {/* Ảnh */}
      <img
        src={item.image || "/placeholder.png"}
        alt={item.title}
        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
      />

      {/* Tên + số lượng */}
      <div className="flex-1 min-w-0">
        <p className="text-base md:text-lg font-semibold text-gray-900 truncate hover:text-orange-500">
          {item.title}
        </p>
        <p className="text-sm text-gray-500">x{item.quantity}</p>
      </div>

      {/* Giá */}
      <div className="flex-shrink-0 text-right min-w-[120px]">
        <p className="text-lg md:text-xl font-bold text-orange-600 mt-0.5">
          {total.toLocaleString("vi-VN")}₫
        </p>
      </div>
    </div>
  );
};

export default OrderProductItem;
