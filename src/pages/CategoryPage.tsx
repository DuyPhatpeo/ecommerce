import CategoryProducts from "../components/category/CategoryProducts";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import SectionBanner from "../components/section/SectionBanner";

const CategoryPage = () => {
  return (
    <>
      <Header />
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Category"
        subtitle="Discover items curated just for your favorite style."
      />
      <CategoryProducts />
      <Footer />
    </>
  );
};

export default CategoryPage;
