import { useParams } from "react-router-dom";
import SectionBanner from "../components/section/SectionBanner";
import Account from "../components/account/Account";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";

const AccountPage = () => {
  const { tab } = useParams<{ tab?: string }>();

  const getBannerInfo = () => {
    switch (tab) {
      case "profile":
        return {
          title: "My Profile",
          subtitle: "Manage your personal information and preferences",
        };
      case "order":
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
      <Header />
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title={bannerInfo.title}
        subtitle={bannerInfo.subtitle}
      />
      <Account />
      <Footer />
    </>
  );
};

export default AccountPage;
