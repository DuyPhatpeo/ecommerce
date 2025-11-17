// src/pages/account/WishlistTab.tsx
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import ProductCard from "../section/ProductCard";
import { useWishlistStore } from "../../stores/wishlistStore";

const WishlistTab: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  // ✅ Lấy data từ Zustand store
  const { wishlistItems, isLoadingList, fetchWishlistItems } =
    useWishlistStore();

  useEffect(() => {
    // ✅ Load wishlist khi component mount
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const visibleProducts = wishlistItems.slice(0, visibleCount);

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-orange-50 opacity-50" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-200">
              <Heart className="text-white fill-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
              <p className="text-sm text-gray-600">
                Your favorite products collection
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoadingList ? (
          <div className="py-16 text-center">
            <div className="inline-block w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your wishlist...
            </p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-orange-200">
              <Heart className="text-pink-600" size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              Your Wishlist is Empty
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Start adding products you love!
              <br />
              Discover amazing items ✨
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {visibleProducts.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>

            {visibleCount < wishlistItems.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-3 font-semibold text-pink-600 transition-all duration-300 border-2 border-pink-500 rounded-xl hover:bg-pink-500 hover:text-white"
                >
                  Load More ({wishlistItems.length - visibleCount} more)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistTab;
