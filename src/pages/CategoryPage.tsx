import CategoryProducts from "../features/category/CategoryProducts";
import SectionBanner from "../components/shared/SectionBanner";

const CategoryPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Category" />
      <CategoryProducts />
    </>
  );
};

export default CategoryPage;
