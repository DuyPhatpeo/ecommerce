import React from "react";

interface Product {
  id: string;
  title: string;
  images?: string[];
  quantity: number;
  regularPrice?: number;
  salePrice?: number;
}

interface Props {
  product: Product;
}

const CheckoutProductItem: React.FC<Props> = ({ product }) => {
  return (
    <div className="flex items-center gap-6 py-6 transition-all hover:bg-orange-50/50">
      {/* Product image */}
      <img
        src={
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : "/placeholder.png"
        }
        alt={product.title}
        className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-orange-100"
      />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-lg text-gray-800 truncate"
          title={product.title}
        >
          {product.title}
        </h3>
        <p className="text-gray-500 mt-1">
          Quantity:{" "}
          <span className="font-medium text-gray-700">{product.quantity}</span>
        </p>
      </div>

      {/* Product price */}
      <div className="text-right">
        <p className="text-lg font-semibold text-orange-600">
          {product.salePrice
            ? `${product.salePrice.toLocaleString()}₫`
            : product.regularPrice
            ? `${product.regularPrice.toLocaleString()}₫`
            : "--"}
        </p>
        {product.salePrice && product.regularPrice && (
          <p className="text-sm text-gray-400 line-through">
            {product.regularPrice.toLocaleString()}₫
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutProductItem;
