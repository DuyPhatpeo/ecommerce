import React from "react";

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
  const totalPrice = item.price * item.quantity;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.title}
          className="w-16 h-16 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p
            className="text-sm font-medium text-gray-800 truncate max-w-[200px]"
            title={item.title}
          >
            {item.title}
          </p>

          <span className="text-xs text-gray-500 mt-1 block">
            x{item.quantity}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-right ml-4 whitespace-nowrap">
        {/* Unit Price */}
        <span className="text-sm font-semibold text-gray-800">
          {item.price.toLocaleString("en-US")}₫
        </span>

        {/* Total */}
        <p className="text-base font-bold text-orange-600 mt-1">
          {totalPrice.toLocaleString("en-US")}₫
        </p>
      </div>
    </div>
  );
};

export default OrderProductItem;
