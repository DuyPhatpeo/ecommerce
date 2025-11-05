import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";
import { useLogout } from "../../hooks/useLogout";

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const { logout } = useLogout();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLoading, setIsLoading] = useState(false);

  /* Handle Responsive */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Desktop default tab */
  useEffect(() => {
    if (!isMobile && !tab) navigate("/account/profile", { replace: true });
  }, [isMobile, tab, navigate]);

  /* Change tab with loading */
  const handleTabChange = (tabId: string) => {
    setIsLoading(true);
    navigate(`/account/${tabId}`);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleBack = () => navigate("/account");

  const renderTab = () => {
    switch (tab) {
      case "profile":
        return <ProfileTab />;
      case "orders":
        return <OrdersTab />;
      case "addresses":
        return <AddressesTab />;
      case "wishlist":
        return <WishlistTab />;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (tab) {
      case "profile":
        return "My Profile";
      case "orders":
        return "Order History";
      case "addresses":
        return "Saved Addresses";
      case "wishlist":
        return "My Wishlist";
      default:
        return "Account";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl -top-20 -left-20 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -bottom-20 -right-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-64 h-64 bg-purple-200 rounded-full opacity-10 blur-3xl top-1/2 left-1/2 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          {(!isMobile || !tab) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-80"
            >
              <AccountSidebar
                activeTab={isMobile && !tab ? "" : tab || "profile"}
                onTabChange={handleTabChange}
                onLogout={logout}
              />
            </motion.div>
          )}

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full"
          >
            {/* Mobile Navigation Header */}
            {isMobile && tab && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-transparent to-blue-50 opacity-50" />
                  <div className="relative flex items-center justify-between p-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-4 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
                    >
                      <ArrowLeft size={18} />
                      <span>My Account</span>
                    </button>
                    <h2 className="text-lg font-bold text-gray-800">
                      {getTabTitle()}
                    </h2>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Container */}
            <div className="relative">
              {/* Loading Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl"
                  >
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-orange-300" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-gray-700">
                        Loading...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-blue-50/30 opacity-50 pointer-events-none" />
                  <div className="relative">{renderTab()}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Need help? Contact our{" "}
            <button className="font-semibold text-orange-600 transition-colors hover:text-orange-700 hover:underline">
              support team
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
