import ConfirmPayment from "../components/confirmpayment/ConfirmPayment";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import SectionBanner from "../components/section/SectionBanner";

const ConfirmPaymentPage = () => {
  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title="Confirm Payment" />
      <ConfirmPayment />
      <Footer />
    </>
  );
};

export default ConfirmPaymentPage;
