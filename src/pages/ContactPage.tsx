import Contact from "../components/contact/Contact";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import SectionBanner from "../components/section/SectionBanner";

const ContactPage = () => {
  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title="Contact Us" />
      <Contact />
      <Footer />
    </>
  );
};

export default ContactPage;
