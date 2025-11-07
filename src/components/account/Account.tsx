import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";

const TAB_COMPONENTS: Record<string, () => React.ReactElement> = {
  profile: () => <ProfileTab />,
  orders: () => <OrdersTab />,
  addresses: () => <AddressesTab />,
  wishlist: () => <WishlistTab />,
};

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const userId = localStorage.getItem("userId");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(tab || null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveTab(tab || null);
  }, [tab]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    setIsLoading(true);
    navigate(`/account/${tabId}`);
  };

  const handleBack = () => {
    setIsLoading(true);
    navigate("/account", { replace: true });
  };

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setIsLoading(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [activeTab, isLoading]);

  const sidebar = useMemo(
    () => (
      <AccountSidebar
        activeTab={activeTab || "profile"}
        onTabChange={handleTabChange}
      />
    ),
    [activeTab]
  );

  const currentTab = useMemo(() => {
    if (!activeTab) return null; // Khi overview thì không hiện tab content
    const TabComponent = TAB_COMPONENTS[activeTab] || TAB_COMPONENTS["profile"];
    return <TabComponent />;
  }, [activeTab]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800">
            You are not logged in
          </h2>
          <p className="mt-2 text-gray-500">
            Please log in to access your account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Log in now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="py-10 sm:py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex gap-6">
          {/* Nếu không có tab (overview) → chỉ hiển thị sidebar */}
          {!activeTab && (
            <div className={`w-full lg:w-80`}>
              <div className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl border border-orange-100 overflow-hidden">
                {sidebar}
              </div>
            </div>
          )}

          {/* Nếu có tab → chỉ hiển thị tab content */}
          {activeTab && (
            <div className="flex-1 w-full">
              {/* Mobile back button */}
              {isMobile && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 mb-4 px-4 py-2.5 font-semibold text-white shadow-md bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl transition-all hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={18} />
                  My Account
                </button>
              )}

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
                <div key={activeTab} className="animate-fadeIn">
                  {currentTab}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Need help?{" "}
          <button className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
