import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import SectionBanner from "../components/section/SectionBanner";
import CheckOut from "../components/checkout/CheckOut";

const CheckOutPage = () => {
  return (
    <>
      <Header />

      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Check Out"
        subtitle="Complete your purchase"
      />
      <CheckOut />
      <Footer />
    </>
  );
};

export default CheckOutPage;
