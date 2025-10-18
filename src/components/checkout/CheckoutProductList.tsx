import React from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  images?: string[];
  quantity: number;
}

interface Props {
  products: Product[];
  loading: boolean;
}

const CheckoutProductList: React.FC<Props> = ({ products, loading }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">Order Items</h2>
        <p className="text-orange-100 mt-1">
          {products.length} {products.length === 1 ? "item" : "items"} in your
          order
        </p>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4 font-medium">
              Loading your items...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-6">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 flex items-center gap-6"
              >
                <img
                  src={
                    Array.isArray(p.images) ? p.images[0] : "/placeholder.png"
                  }
                  alt={p.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <div className="text-gray-600">
                    ${p.price.toLocaleString()} × {p.quantity}
                  </div>
                </div>
                <div className="text-xl font-bold text-orange-600">
                  ${(p.price * p.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            No items in your order
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutProductList;
