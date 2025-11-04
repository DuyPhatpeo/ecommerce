import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

  // --- Handle window resize ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Desktop default tab ---
  useEffect(() => {
    if (!isMobile && !tab) navigate("/account/profile", { replace: true });
  }, [isMobile, tab, navigate]);

  const handleTabChange = (tabId: string) => navigate(`/account/${tabId}`);
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

  const getTabTitle = (tab?: string) => {
    switch (tab) {
      case "profile":
        return "Profile";
      case "orders":
        return "Orders";
      case "addresses":
        return "Addresses";
      case "wishlist":
        return "Wishlist";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 md:px-16">
        <div className="flex flex-col-reverse gap-4 lg:flex-row">
          {/* Sidebar */}
          {(!isMobile || !tab) && (
            <div className="w-full lg:w-1/4">
              <AccountSidebar
                activeTab={isMobile && !tab ? "" : tab || "profile"}
                onTabChange={handleTabChange}
                onLogout={logout}
              />
            </div>
          )}

          {/* Tab content */}
          <div className="w-full lg:w-3/4">
            {/* Mobile: Back button with "Account" */}
            {isMobile && tab && (
              <div className="mb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-orange-400 text-white  hover:bg-orange-500 transition-colors font-medium"
                  aria-label="Go back"
                >
                  <ArrowLeft size={18} strokeWidth={2} />
                  <span>Account</span>
                </button>
              </div>
            )}

            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
