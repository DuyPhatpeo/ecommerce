import ConfirmPayment from "../features/payment/ConfirmPayment";
import SectionBanner from "../components/shared/SectionBanner";

const ConfirmPaymentPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Confirm Payment" />
      <ConfirmPayment />
    </>
  );
};

export default ConfirmPaymentPage;
