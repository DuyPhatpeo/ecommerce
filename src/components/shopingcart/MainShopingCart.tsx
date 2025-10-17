import React from "react";
import SectionBanner from "../section/SectionBanner";
import ShoppingCart from "./ShopingCart";

const MainShopingCart = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Shopping Cart"
        subtitle="Review your items and proceed to checkout"
      />
      <ShoppingCart />
    </>
  );
};

export default MainShopingCart;
