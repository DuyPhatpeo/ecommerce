import React, { memo } from "react";
import { PackageSearch, X } from "lucide-react";
import ProductCard from "../section/ProductCard";
import Button from "../ui/Button";

interface Product {
  id: string;
  title: string;
  salePrice: number;
  regularPrice?: number;
  stock?: number;
  images?: string[];
}

interface ShopListProps {
  paginatedProducts: Product[];
  clearFilters: () => void;
  hasMore: boolean;
  onSeeMore: () => void;
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
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <PackageSearch size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              No products found
            </h3>
            <p className="text-gray-500 mb-4 text-xs sm:text-sm">
              Try adjusting your filters
            </p>
            <Button
              onClick={clearFilters}
              icon={<X size={16} />}
              label={"Clear All"}
              className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow hover:scale-105 transition"
            />
          </div>
        ) : (
          /* Product grid - tighter on mobile */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">
            {paginatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                data={{
                  id: p.id,
                  img: p.images?.[0] || "/placeholder.jpg",
                  title: p.title,
                  salePrice: p.salePrice,
                  regularPrice: p.regularPrice,
                  stock: p.stock,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* See More */}
      {hasMore && !noProducts && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <Button
            onClick={onSeeMore}
            label={"See More"}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-sm transition"
          />
        </div>
      )}
    </main>
  );
};

export default memo(ShopList);
