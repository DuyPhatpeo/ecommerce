import React, { useState, useMemo } from "react";
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

const WishlistTab: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  // ✅ Sample data tự tạo
  const items: WishlistItem[] = useMemo(() => {
    const titles = [
      "Premium Cotton T-Shirt",
      "Slim Fit Jeans",
      "White Sneakers",
    ];
    const prices = [299000, 599000, 899000];
    const images = [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    ];

    return Array.from({ length: 9 }).map((_, i) => ({
      id: String(i + 1),
      title: titles[i % titles.length],
      img: images[i % images.length],
      salePrice: prices[i % prices.length],
      regularPrice: prices[i % prices.length],
      stock: 10,
    }));
  }, []);

  const visibleItems = showAll ? items : items.slice(0, 6); // chỉ hiện 6 item đầu

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            My Wishlist
          </h2>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Your wishlist is empty. Start exploring some products ✨
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>

            {/* See More Button */}
            {!showAll && items.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 font-semibold text-white transition bg-orange-500 rounded-full shadow-md hover:opacity-90"
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
