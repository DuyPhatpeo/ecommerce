import React from "react";
import { Package } from "lucide-react";
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
    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-orange-100 space-y-8">
      <h2 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
        <Package className="w-6 h-6 text-orange-600" />
        Items in this Order ({items.length})
      </h2>

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
    </div>
  );
};

export default OrderProductList;
