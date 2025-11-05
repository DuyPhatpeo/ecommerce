import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
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
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

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

  const visibleProducts = products.slice(0, visibleCount);
  const handleSeeMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      {/* Gradient Background */}
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
          <div className="px-4 py-2 text-sm font-semibold text-pink-600 rounded-lg bg-pink-50">
            {products.length} {products.length === 1 ? "Item" : "Items"}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your wishlist...
            </p>
          </div>
        ) : products.length === 0 ? (
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
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl hover:from-pink-600 hover:to-orange-600 hover:shadow-pink-200 hover:-translate-y-0.5"
            >
              <Sparkles size={18} />
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {visibleProducts.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>

            {visibleCount < products.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleSeeMore}
                  className="px-6 py-3 font-semibold text-pink-600 transition-all duration-300 border-2 border-pink-500 rounded-xl hover:bg-pink-500 hover:text-white"
                >
                  Load More Products ({products.length - visibleCount}{" "}
                  remaining)
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
