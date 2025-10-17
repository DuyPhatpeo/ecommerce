import React from "react";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import SectionBanner from "../components/section/SectionBanner";
import MainCheckOut from "../components/checkout/MainCheckOut";

const CheckOutPage = () => {
  return (
    <>
      <Header />
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Check Out"
        subtitle="Complete your purchase"
      />
      <MainCheckOut />
      <Footer />
    </>
  );
};

export default CheckOutPage;
