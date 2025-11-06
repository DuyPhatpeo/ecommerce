import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          {(!isMobile || !tab) && (
            <div className="w-full lg:w-80">
              <AccountSidebar
                activeTab={isMobile && !tab ? "" : tab || "profile"}
                onTabChange={handleTabChange}
              />
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 w-full">
            {/* Mobile Navigation Header */}
            {isMobile && tab && (
              <div className="flex items-center justify-between p-4 mb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={18} />
                  <span>My Account</span>
                </button>
              </div>
            )}

            {/* Content Container */}
            <div>
              {/* Loading Overlay */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Loading...
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Content */}
              {!isLoading && <div key={tab}>{renderTab()}</div>}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our{" "}
            <button className="font-semibold text-orange-600 transition-colors hover:text-orange-700 hover:underline">
              support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
