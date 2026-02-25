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
  const total = price * quantity;

  return (
    <div className="flex items-center border-b last:border-b-0 py-4 w-full">
      <img
        src={img || images?.[0]}
        alt={title}
        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
      />

      <div className="flex-1 px-4 min-w-0">
        <p className="text-base md:text-lg font-semibold text-gray-900 truncate">
          {title}
        </p>
        <p className="text-sm text-gray-500">x{quantity}</p>
      </div>

      <p className="text-lg md:text-xl font-bold text-orange-600 text-right">
        {total.toLocaleString("vi-VN")}₫
      </p>
    </div>
  );
};

export default ConfirmPaymentProductItem;
