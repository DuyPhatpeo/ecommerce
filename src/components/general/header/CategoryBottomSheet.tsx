import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { MenuItem } from "../../../stores/headerStore";

interface CategoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  categoryMenuRef: React.RefObject<HTMLDivElement | null>;
  navigate: ReturnType<typeof useNavigate>;
}

const CategoryBottomSheet = ({
  isOpen,
  onClose,
  menuItems,
  categoryMenuRef,
  navigate,
}: CategoryBottomSheetProps) => {
  const categoryItem = menuItems.find((item) => item.label === "CATEGORY");

  if (!categoryItem || !categoryItem.subMenu) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={categoryMenuRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[70vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Danh mục giày</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Categories Grid */}
            <div className="overflow-y-auto max-h-[calc(70vh-80px)] px-4 py-4 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categoryItem.subMenu.map((category, index) => (
                  <button
                    key={`${category.label}-${index}`}
                    onClick={() => {
                      if (category.path) {
                        navigate(category.path);
                        onClose();
                      }
                    }}
                    className="flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl transition-all active:scale-95 shadow-sm"
                  >
                    <span className="text-sm font-semibold text-gray-800 text-center">
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryBottomSheet;
