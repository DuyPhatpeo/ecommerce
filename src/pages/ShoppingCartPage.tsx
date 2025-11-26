import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import SectionBanner from "../components/section/SectionBanner";
import ShoppingCart from "../components/shopingcart/ShopingCart";

const ShopingCartPage = () => {
  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title="Shopping Cart" />
      <ShoppingCart />
      <Footer />
    </>
  );
};

export default ShopingCartPage;
