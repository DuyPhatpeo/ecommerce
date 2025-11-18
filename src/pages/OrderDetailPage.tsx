import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import OrderDetail from "../components/order/OrderDetail";
import SectionBanner from "../components/section/SectionBanner";

const OrderDetailPage = () => {
  return (
    <>
      <Header />
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Order Details"
        subtitle="Review your order information and status"
      />
      <OrderDetail />
      <Footer />
    </>
  );
};

export default OrderDetailPage;
