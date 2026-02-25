import { useHeader } from "../../hooks/useHeader";
import CategoryBottomSheet from "./header/CategoryBottomSheet";
import DesktopNav from "./header/DesktopNav";
import Logo from "./header/Logo";
import MobileBottomBar from "./header/MobileBottomBar";
import MobileMenu from "./header/MobileMenu";
import RightActions from "./header/RightActions";
import SearchBox from "./header/SearchBox";

const Header = () => {
  const {
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    cartCount,
    searchQuery,
    user,
    menuItems,
    categoryMenuOpen,
    searchInputRef,
    searchBoxRef,
    mobileMenuRef,
    categoryMenuRef,
    setSearchOpen,
    setMobileOpen,
    setSearchQuery,
    setCategoryMenuOpen,
    handleSearchSubmit,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu,
    closeMobileMenu,
    taskbarItems,
    location,
    navigate,
  } = useHeader();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <div
          className={`relative mx-auto transition-all duration-500 ${
            isScrolled
              ? "bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] w-full"
              : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:w-[75%] xl:w-[65%] lg:mt-6"
          }`}
        >
          <div className="flex items-center justify-between max-w-[1200px] mx-auto h-[60px] xs:h-[65px] sm:h-[75px] lg:h-[80px] px-4 sm:px-6 gap-4 lg:gap-8">
            <Logo />

            <DesktopNav
              menuItems={menuItems}
              activeMenu={activeMenu}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              location={location}
            />

            <RightActions
              user={user ? { name: user.name ?? "Guest" } : null}
              cartCount={cartCount}
              searchOpen={searchOpen}
              mobileOpen={mobileOpen}
              setSearchOpen={setSearchOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>

          <SearchBox
            searchOpen={searchOpen}
            searchBoxRef={searchBoxRef}
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            setSearchOpen={setSearchOpen}
            isScrolled={isScrolled}
          />

          <MobileMenu
            mobileOpen={mobileOpen}
            mobileMenuRef={mobileMenuRef}
            menuItems={menuItems}
            activeMenu={activeMenu}
            toggleSubMenu={toggleSubMenu}
            navigate={navigate}
            closeMobileMenu={closeMobileMenu}
          />
        </div>
      </header>

      <MobileBottomBar
        taskbarItems={taskbarItems}
        location={location}
        navigate={navigate}
        categoryMenuOpen={categoryMenuOpen}
        setCategoryMenuOpen={setCategoryMenuOpen}
      />

      <CategoryBottomSheet
        isOpen={categoryMenuOpen}
        onClose={() => setCategoryMenuOpen(false)}
        menuItems={menuItems}
        categoryMenuRef={categoryMenuRef}
        navigate={navigate}
      />
    </>
  );
};

export default Header;
