// ============================================================
// MainSearch.tsx - Hoàn chỉnh với useShopSort hook
// ============================================================
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { Search, ArrowUpDown } from "lucide-react";
import ProductCard from "../section/ProductCard";
import SectionBanner from "../section/SectionBanner";
import Button from "../ui/Button";
import { useSort } from "../../hooks/useSort";

// ================== Type & Constants ==================
export type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-high";

export interface Product {
  id: number;
  title: string;
  salePrice: number;
  regularPrice?: number;
  stock?: number;
  images?: string[];
  category?: string;
  brand?: string;
}

const ITEMS_PER_PAGE = 8;

// ================== Component ==================
const MainSearch: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  // 🔍 Lấy từ khóa từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("search") || params.get("query") || "";
    setKeyword(value.trim());
  }, [location.search]);

  // 📦 Fetch tất cả products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔎 Filter theo keyword
  useEffect(() => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }

    const lowerKeyword = keyword.toLowerCase();

    const filtered = allProducts.filter((p) => {
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
        : [p.image || "/placeholder.jpg"],
      category: p.category,
      brand: p.brand,
    }));

    setSearchResults(mapped);
  }, [keyword, allProducts]);

  // 🎯 Sort & Pagination
  const { sortBy, setSortBy, paginatedProducts, hasMore, handleSeeMore } =
    useSort<Product>(searchResults, undefined, {
      itemsPerLoad: ITEMS_PER_PAGE,
      syncWithUrl: false,
    });

  const totalFound = searchResults.length;

  // ================== Render ==================
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
            {/* Header + Sort */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                <Search
                  className="inline-block mr-2 text-orange-500"
                  size={18}
                />
                Results for{" "}
                <span className="text-orange-500 font-semibold">
                  "{keyword}"
                </span>{" "}
                ({totalFound} items)
              </h2>

              {/* Sort Dropdown */}
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
                  <option value="price-asc">Low → High</option>
                  <option value="price-desc">High → Low</option>
                  <option value="discount-high">Biggest Discount (%)</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      data={{
                        id: p.id,
                        img: p.images?.[0] || "/placeholder.jpg",
                        title: p.title,
                        salePrice: p.salePrice,
                        regularPrice: p.regularPrice,
                        stock: p.stock,
                      }}
                    />
                  ))}
                </div>

                {/* See More */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <Button
                      onClick={handleSeeMore}
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
