// src/pages/account/WishlistTab.tsx
import React, { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";

import ProductCard from "../../components/shared/ProductCard";
import { useWishlistStore } from "../../stores/wishlistStore";

const WishlistTab: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  // Zustand store
  const { wishlistItems, isLoadingList, fetchWishlistItems } =
    useWishlistStore();

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const visibleProducts = wishlistItems.slice(0, visibleCount);

  return (
    <div className="relative overflow-hidden bg-white border border-orange-100 shadow-xl rounded-3xl">
      {/* Background gradient cùng style Orders */}
      <div className="absolute inset-0 bg-[#f8f6f3] opacity-50" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 shadow-md shadow-orange-100">
              <FiHeart className="text-orange-500 fill-orange-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
              <p className="text-sm text-gray-600">Your saved products</p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoadingList ? (
          <div className="py-16 text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 rounded-xl animate-spin border-t-orange-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your wishlist...
            </p>
          </div>
        ) : wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-100">
              <FiHeart className="text-gray-400" size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              Your Wishlist is Empty
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Save your favorite items to view them later ✨
            </p>
          </div>
        ) : (
          <>
            {/* Product grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {visibleProducts.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>

            {/* Load More */}
            {visibleCount < wishlistItems.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-3 font-semibold text-orange-600 transition-all duration-300 border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white"
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
