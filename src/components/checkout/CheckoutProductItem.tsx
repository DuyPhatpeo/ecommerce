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
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-none">
      <img
        src={
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : "/placeholder.png"
        }
        alt={product.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-100"
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-base font-medium text-gray-800 truncate mb-1"
          title={product.title}
        >
          {product.title}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">x{product.quantity}</p>
          <p className="text-base font-semibold text-orange-600">
            {formatVND(totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProductItem;
