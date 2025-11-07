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
    <div className="flex flex-col sm:flex-row items-center justify-between border-2 border-gray-100 rounded-2xl p-4 bg-gradient-to-r from-white to-gray-50 hover:bg-orange-50/80 hover:border-orange-200 transition-all duration-300 group overflow-hidden">
      {/* Left: Image + Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-shrink-0">
          <img
            src={item.image || "/placeholder.png"}
            alt={item.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-orange-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white">
            {item.quantity}
          </div>
        </div>

        <div className="min-w-0">
          <p
            className="font-semibold text-base sm:text-lg text-gray-800 truncate max-w-[180px] sm:max-w-[220px]"
            title={item.title}
          >
            {item.title}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Unit:{" "}
            <span className="font-medium text-gray-700">
              {item.price.toLocaleString("en-US")}₫
            </span>
          </p>
        </div>
      </div>

      {/* Right: Price Summary */}
      <div className="w-full sm:w-auto text-right sm:ml-auto mt-3 sm:mt-0 flex sm:block justify-between sm:justify-end items-center">
        <span className="text-sm text-gray-500 font-medium sm:hidden">
          Total:
        </span>
        <p className="font-bold text-orange-600 text-lg sm:text-xl">
          {totalPrice.toLocaleString("en-US")}₫
        </p>
      </div>
    </div>
  );
};

export default OrderProductItem;
