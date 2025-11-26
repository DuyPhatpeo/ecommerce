import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import SectionBanner from "../components/section/SectionBanner";
import Shop from "../components/shop/Shop";

const ShopPage = () => {
  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title="Shop" />
      <Shop />
      <Footer />
    </>
  );
};

export default ShopPage;
