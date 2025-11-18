import React from "react";

interface Product {
  id: string;
  title: string;
  images?: string[];
  quantity: number;
  regularPrice?: number;
  salePrice?: number;
}

interface ProductItemProps {
  product: Product;
  formatVND: (value: number) => string;
}

const CheckoutProductItem: React.FC<ProductItemProps> = ({
  product,
  formatVND,
}) => {
  const displayPrice = product.salePrice ?? product.regularPrice ?? 0;
  const totalPrice = displayPrice * product.quantity;

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-none">
      <img
        src={
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : "/placeholder.png"
        }
        alt={product.title}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-gray-800 truncate"
          title={product.title}
        >
          {product.title}
        </p>
        <p className="text-xs text-gray-500">x{product.quantity}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-orange-600">
          {formatVND(totalPrice)}
        </p>
      </div>
    </div>
  );
};

export default CheckoutProductItem;
