import React from "react";
import { ShoppingBag } from "lucide-react";

interface Product {
  id: number;
  title: string;
  images?: string[];
  quantity: number;
  price?: number; // Giá gốc
  salePrice?: number; // Giá giảm (nếu có)
}

interface Props {
  products: Product[];
  loading: boolean;
}

const CheckoutProductList: React.FC<Props> = ({ products, loading }) => {
  const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")} đ`;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex items-center gap-3">
        <ShoppingBag className="w-6 h-6 text-white" />
        <div>
          <h2 className="text-2xl font-bold text-white">
            Products in the order
          </h2>
          <p className="text-orange-100 mt-1 text-sm">
            {products.length} products in the order
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        {loading ? (
          // Loading skeleton
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-orange-50 rounded-2xl p-6 flex items-center gap-6"
              >
                <div className="w-24 h-24 bg-orange-100 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-orange-100 rounded w-1/2" />
                  <div className="h-4 bg-orange-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          // Product list
          <div className="space-y-6">
            {products.map((p) => {
              const hasDiscount =
                p.salePrice !== undefined && p.salePrice < (p.price ?? 0);
              const regularPrice = p.price ?? 0;
              const finalPrice = hasDiscount ? p.salePrice! : regularPrice;

              return (
                <div
                  key={p.id}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 flex items-center gap-6"
                >
                  <img
                    src={
                      Array.isArray(p.images) && p.images.length > 0
                        ? p.images[0]
                        : "/placeholder.png"
                    }
                    alt={p.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-lg text-gray-800 truncate"
                      title={p.title}
                    >
                      {p.title}
                    </h3>
                    <p className="text-gray-500 mt-1">Quantity: {p.quantity}</p>
                  </div>

                  {/* Hiển thị giá */}
                  <div className="text-right">
                    {hasDiscount ? (
                      <>
                        <p className="font-semibold text-orange-600 text-lg">
                          {formatPrice(finalPrice * p.quantity)}
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(regularPrice * p.quantity)}
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Save{" "}
                          {formatPrice(
                            (regularPrice - finalPrice) * p.quantity
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-orange-600 text-lg">
                          {formatPrice(regularPrice * p.quantity)}
                        </p>
                        <p className="text-sm text-gray-400">
                          ({formatPrice(regularPrice)} / product)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            There are no products in the order
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutProductList;
