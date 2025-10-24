import React, { memo } from "react";
import { PackageSearch, X } from "lucide-react";
import ProductCard from "../section/ProductCard";
import Button from "../ui/Button";

interface Product {
  id: number;
  title: string;
  salePrice: number;
  regularPrice?: number;
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
            <Button
              onClick={clearFilters}
              icon={<X size={18} />}
              label={"Clear All"}
              className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg text-sm hover:scale-105 transition-transform"
            />
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
                  salePrice: p.salePrice ?? (p as any).price,
                  regularPrice: p.regularPrice ?? (p as any).oldPrice,
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
          <Button
            onClick={onSeeMore}
            label={"See More"}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md transition-colors"
          />
        </div>
      )}
    </main>
  );
};

export default memo(ShopList);
