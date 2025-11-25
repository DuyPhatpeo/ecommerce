import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // 🔸 Scroll lên đầu trang khi đổi route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // 🔸 Hiện nút khi scroll xuống > 200px
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="
            fixed 
            bottom-30 right-1               
            sm:bottom-28 sm:right-8         
            lg:bottom-20 lg:right-10        
            bg-orange-500 hover:bg-orange-600
            text-white 
            p-2 sm:p-3 
            rounded-xl                
            shadow-lg hover:shadow-xl 
            transition-all duration-300 
            z-50 flex items-center justify-center
          "
        >
          <ArrowUp size={15} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
