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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="py-10 sm:py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          {(!isMobile || !tab) && (
            <div className="w-full lg:w-80">
              <div className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl border border-orange-100 overflow-hidden">
                <AccountSidebar
                  activeTab={isMobile && !tab ? "" : tab || "profile"}
                  onTabChange={handleTabChange}
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 w-full">
            {/* Mobile Header */}
            {isMobile && tab && (
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2.5 font-semibold text-white shadow-md bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl transition-all hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={18} />
                  <span>My Account</span>
                </button>
              </div>
            )}

            {/* Content */}
            {isLoading ? (
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
            ) : (
              <div key={tab}>{renderTab()}</div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center">
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
