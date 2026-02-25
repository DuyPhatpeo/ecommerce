import Search from "../features/search/Search";
import SectionBanner from "../components/shared/SectionBanner";

const SearchPage = () => {
  return (
    <>
      <SectionBanner bgImage="/banner-bg.jpg" title="Search Results" />
      <Search />
    </>
  );
};

export default SearchPage;
