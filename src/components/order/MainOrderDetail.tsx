import React from "react";
import SectionBanner from "../section/SectionBanner";
import OrderDetail from "./OrderDetail";

const MainOrderDetail: React.FC = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Order Details"
        subtitle="Review your order information and status"
      />
      <OrderDetail />
    </>
  );
};

export default MainOrderDetail;
