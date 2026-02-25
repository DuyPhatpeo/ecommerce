import SectionBanner from "../components/shared/SectionBanner";
import ShoppingCart from "../features/cart/ShopingCart";

const ShoppingCartPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Shopping Cart" />
      <ShoppingCart />
    </>
  );
};

export default ShoppingCartPage;
