import SectionBanner from "../components/shared/SectionBanner";
import CheckOut from "../features/checkout/CheckOut";

const CheckOutPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Checkout" />
      <CheckOut />
    </>
  );
};

export default CheckOutPage;
