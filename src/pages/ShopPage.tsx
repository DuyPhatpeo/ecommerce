import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import SectionBanner from "../components/section/SectionBanner";
import Shop from "../components/shop/Shop";

const ShopPage = () => {
  return (
    <>
      <Header />
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Shop"
        subtitle="Step into a world of fashion that speaks your personality."
      />
      <Shop />
      <Footer />
    </>
  );
};

export default ShopPage;
