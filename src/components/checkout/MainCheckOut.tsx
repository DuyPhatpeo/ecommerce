import CheckOut from "./CheckOut";
import SectionBanner from "../section/SectionBanner";

const MainCheckOut = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Check Out"
        subtitle="Complete your purchase"
      />
      <CheckOut />
    </>
  );
};

export default MainCheckOut;
