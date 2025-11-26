import { useState } from "react";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import SectionBanner from "../components/section/SectionBanner";
import ProductDetail from "../components/product/ProductDetail";

const ProductDetailPage = () => {
  const [title, setTitle] = useState("Product Details");

  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title={title} />
      <ProductDetail onLoadTitle={setTitle} />
      <Footer />
    </>
  );
};

export default ProductDetailPage;
