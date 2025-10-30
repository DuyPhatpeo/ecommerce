import React, { useState } from "react";
import ProductCard from "../section/ProductCard";

interface WishlistItem {
  id: string;
  title: string;
  img: string;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
}

interface WishlistTabProps {
  items: WishlistItem[];
}

const WishlistTab: React.FC<WishlistTabProps> = ({ items }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 6); // chỉ hiện 6 item đầu

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl p-6 mx-auto bg-white rounded-2xl md:border md:border-gray-200 md:shadow-sm">
        {/* 🔹 Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            My Wishlist
          </h2>
        </div>

        {/* 🔹 Wishlist Items */}
        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Your wishlist is empty. Start exploring some products ✨
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>

            {/* 🔹 See More Button */}
            {!showAll && items.length > 6 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition"
                >
                  See More
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
