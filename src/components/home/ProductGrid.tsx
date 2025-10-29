import React, { memo, useMemo } from "react";
import ProductCard from "../section/ProductCard";
import type { Section } from "./ProductView";

interface Product {
  id: number;
  title: string;
  price?: number;
  salePrice?: number | null;
  regularPrice?: number;
  oldPrice?: number;
  stock?: number;
  images?: string[];
}

interface ProductGridProps {
  section: Section;
}

const mapProductData = (product: Product) => ({
  id: product.id,
  img: product.images?.[0] || "placeholder.jpg",
  title: product.title,
  salePrice: product.salePrice ?? product.price,
  regularPrice: product.regularPrice ?? product.oldPrice,
  stock: product.stock,
});

// Component hiển thị lưới sản phẩm
const ProductGridDisplay = memo<{ products: Product[] }>(({ products }) => {
  if (!products.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} data={mapProductData(p)} />
      ))}
    </div>
  );
});
ProductGridDisplay.displayName = "ProductGridDisplay";

// Component chính
const ProductGrid: React.FC<ProductGridProps> = ({ section }) => {
  const availableProducts = useMemo(
    () => section?.products.filter((p) => p.stock && p.stock > 0) ?? [],
    [section?.products]
  );

  if (!availableProducts.length)
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 text-center text-gray-500">
        <p>Không có sản phẩm để hiển thị.</p>
      </div>
    );

  return (
    <div data-product-grid>
      <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 md:mb-12">
        <ProductGridDisplay products={availableProducts} />
      </div>
    </div>
  );
};

export default ProductGrid;
