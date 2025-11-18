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

interface ProductListProps {
  products: Product[];
  formatVND: (value: number) => string;
}

const CheckoutProductList: React.FC<ProductListProps> = ({
  products,
  formatVND,
}) => {
  return (
    <div className="border-b border-orange-100 pb-4">
      <div className="flex items-center gap-2 mb-3">
        <ShoppingBag className="w-5 h-5 text-orange-600" />
        <h4 className="font-semibold text-gray-800">
          Products ({products.length})
        </h4>
      </div>
      <div className="space-y-3 pr-2">
        {products.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No products in cart
          </p>
        ) : (
          products.map((product) => (
            <CheckoutProductItem
              key={product.id}
              product={product}
              formatVND={formatVND}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CheckoutProductList;
