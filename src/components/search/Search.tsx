import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import ProductCard from "../section/ProductCard";
import Loader from "../general/Loader";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { Search as SearchIcon } from "lucide-react";
import { useSortStore } from "../../stores/sortStore";

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

const Search: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  // --- Zustand store ---
  const {
    sortBy,
    setSortBy,
    paginatedProducts,
    hasMore,
    handleSeeMore,
    setProducts: setStoreProducts,
  } = useSortStore();

  // --- Lấy keyword từ URL ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("search") || params.get("query") || "";
    setKeyword(value.trim());
  }, [location.search]);

  // --- Fetch products ---
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();

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

        if (mounted) {
          setAllProducts(normalized);
          setStoreProducts(normalized); // đồng bộ với Zustand
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [setStoreProducts]);

  // --- Filter theo keyword ---
  useEffect(() => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }
    const lowerKeyword = keyword.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerKeyword) ||
        (p.brand?.toLowerCase().includes(lowerKeyword) ?? false) ||
        (p.category?.toLowerCase().includes(lowerKeyword) ?? false)
    );
    setSearchResults(filtered);
    setStoreProducts(filtered); // cập nhật cho sort & pagination
  }, [keyword, allProducts, setStoreProducts]);

  if (loading && allProducts.length === 0) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-8 sm:py-12 min-h-screen">
      {keyword ? (
        <>
          {/* Header + Sort */}
          <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              <SearchIcon
                className="inline-block mr-1.5 text-orange-500"
                size={16}
              />
              Results for{" "}
              <span className="text-orange-500 font-semibold">"{keyword}"</span>{" "}
              ({searchResults.length})
            </h2>

            <Select
              value={sortBy}
              onChange={(v) => setSortBy(v as any)}
              className="ml-auto"
              options={[
                { label: "Default", value: "none" },
                { label: "A → Z", value: "name-asc" },
                { label: "Z → A", value: "name-desc" },
                { label: "Low → High", value: "price-asc" },
                { label: "High → Low", value: "price-desc" },
                { label: "Biggest discount (%)", value: "discount-high" },
              ]}
            />
          </div>

          {/* Product Grid */}
          {searchResults.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                {paginatedProducts().map((p) => (
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
              {hasMore() && (
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
  );
};

export default Search;
