import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import Search from "../components/search/Search";
import SectionBanner from "../components/section/SectionBanner";

const SearchPage = () => {
  return (
    <>
      <Header />
      <SectionBanner bgImage="/banner-bg.jpg" title="Search Results" />
      <Search />
      <Footer />
    </>
  );
};

export default SearchPage;
