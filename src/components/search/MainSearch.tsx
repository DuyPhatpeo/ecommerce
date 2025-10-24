import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import ProductCard from "../section/ProductCard";
import SectionBanner from "../section/SectionBanner";
import { Search, Loader2, PackageX } from "lucide-react"; // 🧩 Icons

const MainSearch: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  // 🔍 Extract query param from URL (e.g. /search?query=nike or /search?search=nike)
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

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  const totalFound = useMemo(() => products.length, [products]);

  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Search Products"
        subtitle="Find the products that match your keywords"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p>Loading products...</p>
          </div>
        ) : keyword ? (
          <>
            <div className="flex justify-center items-center gap-2 mb-6 text-gray-800 text-center">
              <Search className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg sm:text-xl font-semibold">
                Results for <span className="text-orange-500">“{keyword}”</span>{" "}
                ({totalFound} found)
              </h2>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {products.map((p) => (
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
            ) : (
              <div className="flex flex-col items-center mt-10 text-gray-500">
                <PackageX className="w-10 h-10 mb-2 text-gray-400" />
                <p>No products found.</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center mt-16 text-gray-400 text-sm sm:text-base">
            <Search className="w-6 h-6 mb-2 text-gray-400" />
            <p>Type a keyword in the search bar to get started</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MainSearch;
