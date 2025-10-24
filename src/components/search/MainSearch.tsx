import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { Search } from "lucide-react";
import ProductCard from "../section/ProductCard";
import SectionBanner from "../section/SectionBanner";
import Button from "../ui/Button";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  images?: string[];
}

const ITEMS_PER_PAGE = 8; // số lượng hiển thị mỗi lần

const MainSearch: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  // 🔍 Get query param from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("search") || params.get("query") || "";
    setKeyword(value.trim());
  }, [location.search]);

  // 📦 Fetch & filter products
  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProducts();

        const lowerKeyword = keyword.toLowerCase();

        // Filter by title, brand, or category
        const filtered = data.filter((p: any) => {
          const title = p.title?.toLowerCase() || "";
          const brand = p.brand?.toLowerCase() || "";
          const category = p.category?.toLowerCase() || "";
          return (
            title.includes(lowerKeyword) ||
            brand.includes(lowerKeyword) ||
            category.includes(lowerKeyword)
          );
        });

        // ✅ Only take the first image per product
        const mapped: Product[] = filtered.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          oldPrice: p.oldPrice,
          stock: p.stock,
          images: Array.isArray(p.images)
            ? p.images
            : [p.image || "/no-image.png"],
        }));

        setProducts(mapped);
        setVisibleCount(ITEMS_PER_PAGE); // reset khi search mới
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  const totalFound = useMemo(() => products.length, [products]);
  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );
  const hasMore = visibleCount < totalFound;

  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Search Results"
        subtitle="Discover products that match your keyword"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 min-h-screen">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading products...
          </p>
        ) : keyword ? (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800 text-center">
              <Search className="inline-block mr-2 text-orange-500" size={18} />
              Results for{" "}
              <span className="text-orange-500 font-semibold">
                “{keyword}”
              </span>{" "}
              ({totalFound} items)
            </h2>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {visibleProducts.map((p) => (
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

                {/* 🔽 See More button */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <Button
                      onClick={() =>
                        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                      }
                      label="See More"
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 hover:scale-105"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                No products found matching your keyword.
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 mt-16 text-sm sm:text-base">
            Type a keyword into the search bar to get started 🛍️
          </div>
        )}
      </div>
    </>
  );
};

export default MainSearch;
