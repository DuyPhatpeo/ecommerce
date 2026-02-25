import SectionBanner from "../components/shared/SectionBanner";
import Shop from "../features/shop/Shop";

const ShopPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Shop" />
      <Shop />
    </>
  );
};

export default ShopPage;
