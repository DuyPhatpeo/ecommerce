import React from "react";
import { ShoppingBag } from "lucide-react";
import CheckoutProductItem from "./CheckoutProductItem";

interface Product {
  id: string;
  title: string;
  images?: string[];
  quantity: number;
  regularPrice?: number;
  salePrice?: number;
}

interface Props {
  products: Product[];
  loading: boolean;
}

const CheckoutProductList: React.FC<Props> = ({ products, loading }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-orange-100 space-y-8">
      <h2 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-orange-600" />
        Products in the Order ({products.length})
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-14 h-14 text-orange-500" />
          </div>
          <p className="text-gray-800 text-xl font-semibold mb-2">
            No products found
          </p>
          <p className="text-gray-500">There are no products in this order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="transition-all duration-300 rounded-2xl">
              <CheckoutProductItem product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckoutProductList;
