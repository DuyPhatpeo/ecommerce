import FAQ from "../components/faq/FAQ";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import SectionBanner from "../components/section/SectionBanner";

const FAQPage = () => {
  return (
    <>
      <Header />
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Frequently Asked Questions"
      />
      <FAQ />
      <Footer />
    </>
  );
};

export default FAQPage;
