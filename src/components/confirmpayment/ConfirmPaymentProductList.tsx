import React from "react";
import type { Product } from "../../stores/checkoutStore";
import ConfirmPaymentProductItem from "./ConfirmPaymentProductItem";

interface Props {
  products: (Product & { quantity: number })[];
}

const ConfirmPaymentProductList: React.FC<Props> = ({ products }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-orange-600">Selected Products</span>
      </h3>
      <div className="space-y-4">
        {products.map((item) => (
          <ConfirmPaymentProductItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ConfirmPaymentProductList;
