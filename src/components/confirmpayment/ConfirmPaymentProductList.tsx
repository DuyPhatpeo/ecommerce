import React from "react";
import { Package } from "lucide-react";
import type { Product } from "../../stores/checkoutStore";
import ConfirmPaymentProductItem from "./ConfirmPaymentProductItem";

interface Props {
  products: (Product & { quantity: number })[];
}

const ConfirmPaymentProductList: React.FC<Props> = ({ products }) => {
  return (
    <div className="bg-white rounded-3xl p-8 border-2 border-orange-100 space-y-8">
      {/* Header */}
      <h2 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
        <Package className="w-6 h-6 text-orange-600" />
        Selected Products ({products.length})
      </h2>

      {/* Content */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package className="w-14 h-14 text-orange-500" />
          </div>
          <p className="text-gray-800 text-xl font-semibold mb-2">
            No products selected
          </p>
          <p className="text-gray-500">You haven't added any products yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="transition-all duration-300 rounded-2xl"
            >
              <ConfirmPaymentProductItem {...item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmPaymentProductList;
