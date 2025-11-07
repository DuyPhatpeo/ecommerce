import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { Search, ArrowUpDown } from "lucide-react";
import ProductCard from "../section/ProductCard";
import SectionBanner from "../section/SectionBanner";
import Button from "../ui/Button";
import { useSort } from "../../hooks/useSort";

export type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-high";

export interface Product {
  id: string;
  title: string;
  salePrice: number;
  regularPrice: number;
  stock: number;
  images: string[];
  category?: string;
  brand?: string;
}

const ITEMS_PER_PAGE = 8;

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

        // Normalize dữ liệu: salePrice/regularPrice/stock/images
        const normalized: Product[] = data.map((p: any) => ({
          id: p.id,
          title: p.title || "Untitled Product",
          salePrice: p.salePrice ?? p.price ?? 0,
          regularPrice: p.regularPrice ?? p.oldPrice ?? p.salePrice ?? 0,
          stock: p.stock ?? 0,
          images: Array.isArray(p.images)
            ? p.images
            : [p.image || "/placeholder.jpg"],
          category: p.category,
          brand: p.brand,
        }));

        setAllProducts(normalized);
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
      return (
        p.title.toLowerCase().includes(lowerKeyword) ||
        (p.brand?.toLowerCase().includes(lowerKeyword) ?? false) ||
        (p.category?.toLowerCase().includes(lowerKeyword) ?? false)
      );
    });

    setSearchResults(filtered);
  }, [keyword, allProducts]);

  // 🎯 Sort & Pagination
  const { sortBy, setSortBy, paginatedProducts, hasMore, handleSeeMore } =
    useSort<Product>(searchResults, undefined, {
      itemsPerLoad: ITEMS_PER_PAGE,
      syncWithUrl: false,
    });

  const totalFound = searchResults.length;

  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Search Results"
        subtitle="Discover products that match your keyword"
      />

      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-8 sm:py-12 min-h-screen">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading products...
          </p>
        ) : keyword ? (
          <>
            {/* Header + Sort */}
            <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                <Search
                  className="inline-block mr-1.5 text-orange-500"
                  size={16}
                />
                Results for{" "}
                <span className="text-orange-500 font-semibold">
                  "{keyword}"
                </span>{" "}
                ({totalFound})
              </h2>

              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm">
                <ArrowUpDown size={16} className="text-orange-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-1.5 py-0.5 border-none outline-none bg-transparent text-gray-800 text-sm"
                >
                  <option value="none">Default</option>
                  <option value="name-asc">A → Z</option>
                  <option value="name-desc">Z → A</option>
                  <option value="price-asc">Low → High</option>
                  <option value="price-desc">High → Low</option>
                  <option value="discount-high">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
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

                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={handleSeeMore}
                      label="See More"
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-sm transition"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 mt-10 text-sm">
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
