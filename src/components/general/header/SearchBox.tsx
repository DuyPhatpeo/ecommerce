// 📁 components/Header/SearchBox.tsx
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBoxProps {
  searchOpen: boolean;
  searchBoxRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setSearchOpen: (open: boolean) => void;
  isScrolled: boolean;
}

const SearchBox = ({
  searchOpen,
  searchBoxRef,
  searchInputRef,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  setSearchOpen,
}: SearchBoxProps) => (
  <AnimatePresence>
    {searchOpen && (
      <motion.div
        ref={searchBoxRef}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="flex justify-center bg-orange-50 py-3 shadow-md rounded-b-lg">
          <div className="relative px-4 w-full max-w-[1200px]">
            <FiSearch
              className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none"
              size={20}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search products..."
              className="w-full pl-12 pr-10 py-2.5 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 p-1"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SearchBox;
