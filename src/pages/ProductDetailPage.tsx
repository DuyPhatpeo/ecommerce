import { useState } from "react";
import SectionBanner from "../components/shared/SectionBanner";
import ProductDetail from "../features/product/ProductDetail";

const ProductDetailPage = () => {
  const [title, setTitle] = useState("Product Details");

  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title={title} />
      <ProductDetail onLoadTitle={setTitle} />
    </>
  );
};

export default ProductDetailPage;
