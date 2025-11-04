import React, { useState, useEffect } from "react";
import ProductCard from "../section/ProductCard";
import { getProductById } from "../../api/productApi";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  img: string;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
}

const WishlistTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const wishlistIds: string[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      if (!wishlistIds.length) return;

      setLoading(true);
      try {
        const promises = wishlistIds.map((id) => getProductById(id));
        const res = await Promise.all(promises);

        // 🔹 Dùng ảnh đầu tiên nếu có
        const productsWithFirstImage = res.map((p: Product) => ({
          ...p,
          img: p.images?.[0] || p.img,
        }));

        setProducts(productsWithFirstImage);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải sản phẩm trong wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const visibleProducts = showAll ? products : products.slice(0, 6);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white border border-orange-100 rounded-3xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            My Wishlist
          </h2>
        </div>

        {/* Wishlist Items */}
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Your wishlist is empty. Start exploring some products ✨
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
              {visibleProducts.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>

            {/* See More Button */}
            {!showAll && products.length > 6 && (
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
