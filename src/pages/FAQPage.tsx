import FAQ from "../features/faq/FAQ";
import SectionBanner from "../components/shared/SectionBanner";

const FAQPage = () => {
  return (
    <>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title="Frequently Asked Questions"
      />
      <FAQ />
    </>
  );
};

export default FAQPage;
