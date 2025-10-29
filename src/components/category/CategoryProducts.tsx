import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Sparkles, Filter, ShoppingBag, ArrowUpDown } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ShopFilter from "../shop/ShopFilter";
import Button from "../ui/Button";
import ProductCard from "../section/ProductCard";

interface Product {
  id: number;
  title: string;
  salePrice: number;
  regularPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
}

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- State chính ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // --- Đọc filter/sort từ URL ---
  const [brandFilter, setBrandFilter] = useState<string[]>(
    searchParams.getAll("brand")
  );
  const [colorFilter, setColorFilter] = useState<string[]>(
    searchParams.getAll("color")
  );
  const [sizeFilter, setSizeFilter] = useState<string[]>(
    searchParams.getAll("size")
  );
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">(
    (searchParams.get("stock") as "all" | "in" | "out") || "all"
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") || "none"
  );
  const [priceRange, setPriceRange] = useState({
    min: Number(searchParams.get("min")) || 0,
    max: Number(searchParams.get("max")) || 100000000,
  });

  // --- Fetch sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data: Product[] = await getProducts({ category });
        setProducts(data || []);
      } catch {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // --- Danh sách tùy chọn filter ---
  const brandOptions = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ];
  const colorOptions = [
    ...new Set(products.map((p) => p.color).filter(Boolean)),
  ];
  const sizeOptions = [...new Set(products.map((p) => p.size).filter(Boolean))];

  // --- Cập nhật URL mỗi khi filter thay đổi ---
  useEffect(() => {
    const params: Record<string, string | string[]> = {};

    if (brandFilter.length) params.brand = brandFilter;
    if (colorFilter.length) params.color = colorFilter;
    if (sizeFilter.length) params.size = sizeFilter;
    if (stockFilter !== "all") params.stock = stockFilter;
    if (sortBy !== "none") params.sort = sortBy;
    if (priceRange.min > 0) params.min = String(priceRange.min);
    if (priceRange.max < 10000000) params.max = String(priceRange.max);

    setSearchParams(params as any, { replace: true });
  }, [brandFilter, colorFilter, sizeFilter, stockFilter, priceRange, sortBy]);

  // --- Lọc sản phẩm ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchBrand =
        brandFilter.length === 0 || brandFilter.includes(p.brand || "");
      const matchColor =
        colorFilter.length === 0 || colorFilter.includes(p.color || "");
      const matchSize =
        sizeFilter.length === 0 || sizeFilter.includes(p.size || "");
      const matchStock =
        stockFilter === "all"
          ? true
          : stockFilter === "in"
          ? (p.stock ?? 0) > 0
          : (p.stock ?? 0) <= 0;
      const matchPrice =
        p.salePrice >= priceRange.min && p.salePrice <= priceRange.max;

      return matchBrand && matchColor && matchSize && matchStock && matchPrice;
    });
  }, [products, brandFilter, colorFilter, sizeFilter, stockFilter, priceRange]);

  // --- Sắp xếp & đẩy hết hàng xuống ---
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];

    switch (sortBy) {
      case "name-asc":
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        items.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        items.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-desc":
        items.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "discount-high":
        items.sort(
          (a, b) =>
            (b.regularPrice ?? 0) -
            (b.salePrice ?? 0) -
            ((a.regularPrice ?? 0) - (a.salePrice ?? 0))
        );
        break;
    }

    // ⚡ Sản phẩm còn hàng trước
    items.sort((a, b) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });

    return items;
  }, [filteredProducts, sortBy]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const clearFilters = () => {
    setBrandFilter([]);
    setColorFilter([]);
    setSizeFilter([]);
    setStockFilter("all");
    setSortBy("none");
    setPriceRange({ min: 0, max: 10000000 });
    setSearchParams({});
  };

  const capitalize = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <section className="w-full min-h-screen py-8 px-3 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
            <Sparkles size={18} />
            <span>{capitalize(category) || "All Products"}</span>
            <ShoppingBag size={18} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            {category ? `${capitalize(category)} Collection` : "Our Collection"}
          </h2>
        </div>

        {/* --- Toolbar --- */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-gray-700 text-sm"
            icon={<Filter size={18} />}
            label={"Filter"}
          />

          {/* --- Sort --- */}
          <div className="ml-auto flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <ArrowUpDown size={18} className="text-orange-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
              <option value="discount-high">Biggest discount</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* --- Sidebar --- */}
          <div className="lg:w-64 shrink-0 self-start">
            <ShopFilter
              context="category"
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              categoryFilter={[]}
              setCategoryFilter={() => {}}
              categoryOptions={[]}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              sizeFilter={sizeFilter}
              setSizeFilter={setSizeFilter}
              brandOptions={brandOptions}
              hasActiveFilters={
                brandFilter.length > 0 ||
                colorFilter.length > 0 ||
                sizeFilter.length > 0 ||
                stockFilter !== "all"
              }
              clearFilters={clearFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceMin={0}
              priceMax={10000000}
              priceStep={100000}
            />
          </div>

          {/* --- Grid sản phẩm --- */}
          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex justify-center pt-20 bg-white/60 z-10">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-dashed border-gray-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
              {visibleProducts.map((p) => (
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

            {visibleCount < sortedProducts.length && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  label="See More"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md transition-all hover:scale-105"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts;
