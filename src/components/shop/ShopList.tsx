import React, { memo } from "react";
import { PackageSearch, X } from "lucide-react";
import ProductCard from "../section/ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  images?: string[];
}

interface ShopListProps {
  paginatedProducts: Product[];
  clearFilters: () => void;
  hasMore: boolean; // còn sản phẩm để load
  onSeeMore: () => void; // handler See More
}

const ShopList: React.FC<ShopListProps> = ({
  paginatedProducts,
  clearFilters,
  hasMore,
  onSeeMore,
}) => {
  const noProducts = paginatedProducts.length === 0;

  return (
    <main className="flex-1">
      <div>
        {/* Empty state */}
        {noProducts ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageSearch size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Try adjusting your filters
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg text-sm hover:scale-105 transition-transform"
            >
              <X size={18} />
              Clear All
            </button>
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {paginatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                data={{
                  id: p.id,
                  img: p.images?.[0] || "/no-image.png",
                  title: p.title,
                  price: p.price,
                  oldPrice: p.oldPrice,
                  stock: p.stock,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* See More */}
      {hasMore && !noProducts && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onSeeMore}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md transition-colors"
          >
            See More
          </button>
        </div>
      )}
    </main>
  );
};

export default memo(ShopList);
