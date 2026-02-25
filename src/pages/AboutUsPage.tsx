import AboutUs from "../features/about/AboutUs";
import SectionBanner from "../components/shared/SectionBanner";

const AboutUsPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="About Us" />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;
