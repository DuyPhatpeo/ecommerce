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
    <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-md transition-all duration-300 hover:shadow-lg">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between border-b border-orange-200 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-orange-600 w-6 h-6" />
          <h3 className="text-xl font-bold text-gray-900">
            Products in the Order
          </h3>
        </div>
        <p className="text-sm text-gray-500">
          {products.length} item{products.length !== 1 && "s"}
        </p>
      </div>

      {/* ===== BODY ===== */}
      <div className="mt-6">
        {loading ? (
          // 🌀 Loading State
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg font-medium">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          // ❌ Empty State
          <div className="text-center py-16">
            <div className="bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag className="w-14 h-14 text-orange-500" />
            </div>
            <p className="text-gray-800 text-xl font-semibold mb-2">
              No products found
            </p>
            <p className="text-gray-500">
              There are no products in this order.
            </p>
          </div>
        ) : (
          // 🛍 Product List
          <div className="divide-y divide-orange-50">
            {products.map((p) => (
              <CheckoutProductItem key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutProductList;
