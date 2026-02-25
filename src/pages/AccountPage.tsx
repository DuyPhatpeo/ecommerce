import { useParams } from "react-router-dom";
import SectionBanner from "../components/shared/SectionBanner";
import Account from "../features/account/Account";

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
      <SectionBanner bgImage="/banner-bg.jpg" title={bannerInfo.title} />
      <Account />
    </>
  );
};

export default AccountPage;
