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

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(true);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure default tab
  useEffect(() => {
    if (!tab) {
      navigate("/account/profile", { replace: true });
      return;
    }
    setShowSidebar(!isMobile); // Mobile: hide sidebar when tab selected
  }, [tab, isMobile, navigate]);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleTabChange = (tabId: string) => {
    navigate(`/account/${tabId}`);
    if (isMobile) setShowSidebar(false); // Mobile: hide sidebar when tab selected
  };

  const handleBack = () => {
    if (isMobile) {
      setShowSidebar(true); // Mobile: show sidebar
    } else {
      navigate("/account");
    }
  };

  const renderTab = () => {
    switch (tab) {
      case "profile":
        return (
          <ProfileTab
            profile={profile}
            editedProfile={editedProfile}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
            onChange={(field, value) =>
              setEditedProfile({ ...editedProfile, [field]: value })
            }
          />
        );
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
    <div className="px-2 py-8 mx-auto max-w-7xl sm:px-6 md:px-16">
      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-full lg:w-1/4">
            <AccountSidebar
              activeTab={tab || "profile"}
              onTabChange={handleTabChange}
              onLogout={logout}
            />
          </div>
        )}

        {/* Content */}
        {tab && (!isMobile || !showSidebar) && (
          <div className="w-full lg:w-3/4">
            {isMobile && (
              <div className="flex justify-start mb-2">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-orange-500 rounded-full shadow-md hover:bg-orange-600 active:scale-95"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            )}
            {renderTab()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
