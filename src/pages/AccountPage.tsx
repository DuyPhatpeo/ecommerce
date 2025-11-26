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
        };
      case "order":
        return {
          title: "Order History",
        };
      case "addresses":
        return {
          title: "Saved Addresses",
        };
      case "wishlist":
        return {
          title: "My Wishlist",
        };
      default:
        return {
          title: "My Account",
        };
    }
  };

  const bannerInfo = getBannerInfo();

  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title={bannerInfo.title} />
      <Account />
      <Footer />
    </>
  );
};

export default AccountPage;
