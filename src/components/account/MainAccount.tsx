import { useParams } from "react-router-dom";
import SectionBanner from "../section/SectionBanner";
import Account from "./Account";

const MainAccount = () => {
  const { tab } = useParams<{ tab?: string }>();

  const getBannerInfo = () => {
    switch (tab) {
      case "profile":
        return {
          title: "My Profile",
          subtitle: "Manage your personal information and preferences",
        };
      case "orders":
        return {
          title: "Order History",
          subtitle: "Track and manage your orders",
        };
      case "addresses":
        return {
          title: "Saved Addresses",
          subtitle: "Manage your delivery and billing addresses",
        };
      case "wishlist":
        return {
          title: "My Wishlist",
          subtitle: "Your favorite products collection",
        };
      default:
        return {
          title: "My Account",
          subtitle: "Manage your personal information and orders",
        };
    }
  };

  const bannerInfo = getBannerInfo();

  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title={bannerInfo.title}
        subtitle={bannerInfo.subtitle}
      />
      <Account />
    </>
  );
};

export default MainAccount;
