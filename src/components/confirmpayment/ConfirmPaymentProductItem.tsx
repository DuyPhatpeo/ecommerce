import React from "react";
import type { Product } from "../../stores/checkoutStore";

interface Props extends Product {
  quantity: number;
}

const ConfirmPaymentProductItem: React.FC<Props> = ({
  img,
  images,
  title,
  price,
  quantity,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0">
      {/* Ảnh */}
      <img
        src={img || images?.[0]}
        alt={title}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
      />

      {/* Tên + Số lượng */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-500">x{quantity}</p>
      </div>

      {/* Giá */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold text-orange-600">
          {(price * quantity).toLocaleString("vi-VN")}₫
        </p>
      </div>
    </div>
  );
};

export default ConfirmPaymentProductItem;
