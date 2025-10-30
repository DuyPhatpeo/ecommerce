import React from "react";
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
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
            {items.map((item) => (
              <ProductCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistTab;
