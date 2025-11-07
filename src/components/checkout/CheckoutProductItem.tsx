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
  const displayPrice = product.salePrice ?? product.regularPrice ?? 0;
  const totalPrice = displayPrice * product.quantity;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : "/placeholder.png"
          }
          alt={product.title}
          className="w-16 h-16 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <h3
            className="text-sm font-medium text-gray-800 truncate max-w-[200px]"
            title={product.title}
          >
            {product.title}
          </h3>

          <span className="text-xs text-gray-500 mt-1 block">
            x{product.quantity}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-right ml-4 whitespace-nowrap">
        {/* Giá đơn vị */}
        {product.salePrice && product.regularPrice ? (
          <div>
            <span className="text-sm font-semibold text-gray-800">
              {product.salePrice.toLocaleString("en-US")}₫
            </span>
            <span className="text-xs text-gray-400 line-through ml-1">
              {product.regularPrice.toLocaleString("en-US")}₫
            </span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-gray-800">
            {displayPrice.toLocaleString("en-US")}₫
          </span>
        )}

        {/* Tổng */}
        <p className="text-base font-bold text-orange-600 mt-1">
          {totalPrice.toLocaleString("en-US")}₫
        </p>
      </div>
    </div>
  );
};

export default CheckoutProductItem;
