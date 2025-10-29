import React from "react";
import SectionBanner from "../section/SectionBanner";
import CategoryProducts from "./CategoryProducts";

const MainCategory: React.FC = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Category"
        subtitle="Discover items curated just for your favorite style."
      />
      <CategoryProducts />
    </>
  );
};

export default MainCategory;
