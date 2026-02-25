import OrderDetail from "../features/order/OrderDetail";
import SectionBanner from "../components/shared/SectionBanner";

const OrderDetailPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Order Details" />
      <OrderDetail />
    </>
  );
};

export default OrderDetailPage;
