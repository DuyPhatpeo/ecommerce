import React from "react";
import { FiPackage } from "react-icons/fi";
import OrderProductItem from "./OrderProductItem";

interface OrderItem {
  id: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Props {
  items: OrderItem[];
}

const OrderProductList: React.FC<Props> = ({ items }) => {
  return (
    <div className="bg-white rounded-3xl  p-8 border-2 border-orange-100 space-y-8">
      {/* Header */}
      <h2 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
        <FiPackage className="w-6 h-6 text-orange-600" />
        Products in Order ({items.length})
      </h2>

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FiPackage className="w-14 h-14 text-orange-500" />
          </div>
          <p className="text-gray-800 text-xl font-semibold mb-2">
            No products found
          </p>
          <p className="text-gray-500">There are no products in this order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="transition-all duration-300 rounded-2xl"
            >
              <OrderProductItem item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderProductList;
