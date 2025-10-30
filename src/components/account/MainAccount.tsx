import SectionBanner from "../section/SectionBanner";
import Account from "./Account";

const MainAccount = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="My Account"
        subtitle="Manage your personal information and orders"
      />
      <Account />
    </>
  );
};

export default MainAccount;
