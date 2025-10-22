import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../section/ProductCard";
import Button from "../ui/Button";
import { getProducts } from "../../api/productApi";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
}

interface Section {
  title: string;
  subtitle: string;
  products: Product[];
}

const ProductList: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // ✅ Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Product[] = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid product data");

        const latest = data.filter((p) => p.status === "latest").slice(0, 8);
        const coming = data.filter((p) => p.status === "coming").slice(0, 8);

        setSections([
          {
            title: "Latest Products",
            subtitle: "Discover our newest arrivals",
            products: latest,
          },
          {
            title: "Coming Products",
            subtitle: "Pre-order exclusive releases",
            products: coming,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setSections([]);
      }
    };

    fetchData();
  }, []);

  // ⏭ Chuyển slide có debounce animation
  const handleNext = useCallback(() => {
    if (isAnimating || sections.length === 0) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, sections.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || sections.length === 0) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, sections.length]);

  // ⏳ Trạng thái loading
  if (sections.length === 0) {
    return (
      <div className="w-full py-20 text-center text-gray-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  const currentSection = sections[current];

  return (
    <section className="w-full py-20 px-2 sm:px-6 md:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            <span>Special Collection</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
            {currentSection.title}
          </h2>

          <p className="text-gray-600 text-base max-w-xl mx-auto md:mx-0 mt-2">
            {currentSection.subtitle}. Designed with style, comfort, and
            performance in mind.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrev}
            disabled={isAnimating}
            icon={<ArrowLeft size={20} />}
            className="w-14 h-14 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-2xl shadow-sm"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {sections.map((_, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    if (!isAnimating && idx !== current) {
                      setIsAnimating(true);
                      setCurrent(idx);
                      setTimeout(() => setIsAnimating(false), 600);
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current
                      ? "w-12 bg-gradient-to-r from-orange-500 to-red-500"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {current + 1} / {sections.length}
            </span>
          </div>

          <Button
            onClick={handleNext}
            disabled={isAnimating}
            icon={<ArrowRight size={20} />}
            className="w-14 h-14 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-2xl shadow-sm"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto relative">
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6justify-items-center transition-all duration-500 ease-in-out ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {currentSection.products.map((product) => (
            <ProductCard
              key={product.id}
              data={{
                id: product.id,
                img: product.images?.[0] || "no-image.png",
                title: product.title,
                price: product.price,
                oldPrice: product.oldPrice,
                stock: product.stock,
              }}
            />
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Products Available" },
            { value: "50K+", label: "Happy Customers" },
            { value: "4.9★", label: "Average Rating" },
            { value: "Free", label: "Shipping & Returns" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
