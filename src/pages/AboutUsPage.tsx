import AboutUs from "../components/about/AboutUs";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import SectionBanner from "../components/section/SectionBanner";

const AboutUsPage = () => {
  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title="About Us" />
      <AboutUs />
      <Footer />
    </>
  );
};

export default AboutUsPage;
