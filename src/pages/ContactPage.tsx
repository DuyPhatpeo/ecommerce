import Contact from "../features/contact/Contact";
import SectionBanner from "../components/shared/SectionBanner";

const ContactPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Contact Us" />
      <Contact />
    </>
  );
};

export default ContactPage;
