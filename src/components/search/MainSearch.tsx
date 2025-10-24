import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { Search, ArrowUpDown } from "lucide-react";
import ProductCard from "../section/ProductCard";
import SectionBanner from "../section/SectionBanner";
import Button from "../ui/Button";

interface Product {
  id: number;
  title: string;
  salePrice: number; // VNĐ
  regularPrice?: number;
  stock?: number;
  images?: string[];
  category?: string;
  brand?: string;
}

type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-high";

const ITEMS_PER_PAGE = 8;

const MainSearch: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const location = useLocation();

  // 🔍 Lấy từ khóa từ URL
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

        const mapped: Product[] = filtered.map((p: any) => ({
          id: p.id,
          title: p.title,
          salePrice: p.salePrice ?? p.price,
          regularPrice: p.regularPrice ?? p.oldPrice,
          stock: p.stock,
          images: Array.isArray(p.images)
            ? p.images
            : [p.image || "/no-image.png"],
          category: p.category,
          brand: p.brand,
        }));

        setProducts(mapped);
        setVisibleCount(ITEMS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  // 🧮 Sorting logic (đồng bộ với Shop)
  const sortedProducts = useMemo(() => {
    let sorted = [...products];

    const getFinalPrice = (p: Product) => {
      if (p.salePrice && p.salePrice > 0) return p.salePrice;
      if (p.regularPrice && p.regularPrice > 0) return p.regularPrice;
      return 0;
    };

    const getDiscountPercent = (p: Product) => {
      if (
        p.regularPrice &&
        p.salePrice &&
        p.regularPrice > p.salePrice &&
        p.regularPrice > 0
      ) {
        return ((p.regularPrice - p.salePrice) / p.regularPrice) * 100;
      }
      return 0;
    };

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case "price-asc":
        sorted.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
        break;

      case "price-desc":
        sorted.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
        break;

      case "discount-high":
        const discounted = sorted.filter((p) => getDiscountPercent(p) > 0);
        discounted.sort(
          (a, b) => getDiscountPercent(b) - getDiscountPercent(a)
        );
        const nonDiscounted = sorted.filter((p) => getDiscountPercent(p) === 0);
        sorted = [...discounted, ...nonDiscounted];
        break;
    }

    // Ưu tiên sản phẩm còn hàng
    sorted.sort((a, b) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });

    return sorted;
  }, [products, sortBy]);

  const totalFound = sortedProducts.length;
  const visibleProducts = useMemo(
    () => sortedProducts.slice(0, visibleCount),
    [sortedProducts, visibleCount]
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
            <div className="flex flex-wrap justify-between items-center mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                <Search
                  className="inline-block mr-2 text-orange-500"
                  size={18}
                />
                Results for{" "}
                <span className="text-orange-500 font-semibold">
                  “{keyword}”
                </span>{" "}
                ({totalFound} items)
              </h2>

              {/* 🔽 Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                <ArrowUpDown size={18} className="text-orange-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
                >
                  <option value="none">Default</option>
                  <option value="name-asc">A → Z</option>
                  <option value="name-desc">Z → A</option>
                  <option value="price-asc">Low → high</option>
                  <option value="price-desc">High → low</option>
                  <option value="discount-high">Biggest discount (%)</option>
                </select>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {visibleProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      data={{
                        id: p.id,
                        img: p.images?.[0] || "/no-image.png",
                        title: p.title,
                        salePrice: p.salePrice,
                        regularPrice: p.regularPrice,
                        stock: p.stock,
                      }}
                    />
                  ))}
                </div>

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
