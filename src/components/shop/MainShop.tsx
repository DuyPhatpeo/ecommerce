import React from "react";
import SectionBanner from "../section/SectionBanner";
import Shop from "./Shop";

const MainShop = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Shop"
        subtitle="Step into a world of fashion that speaks your personality."
      />
      <Shop />
    </>
  );
};

export default MainShop;
