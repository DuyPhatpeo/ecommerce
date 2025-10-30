import { useState, useEffect, useMemo } from "react";
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
  const activeTab = tab || "";

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!tab) {
      if (isMobile) {
        setShowSidebar(true);
      } else {
        navigate("/account/profile", { replace: true });
      }
      return;
    }

    setShowSidebar(!isMobile);
  }, [tab, isMobile]);

  const handleTabChange = (tabId: string) => navigate(`/account/${tabId}`);
  const handleBack = () => navigate("/account");
  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const orders = useMemo(
    () => [
      {
        id: "ORD-001",
        date: "2025-10-25",
        status: "Shipping",
        total: "1250000",
        items: 3,
      },
      {
        id: "ORD-002",
        date: "2025-10-20",
        status: "Completed",
        total: "85000000",
        items: 2,
      },
      {
        id: "ORD-003",
        date: "2025-10-15",
        status: "Completed",
        total: "2100000",
        items: 5,
      },
    ],
    []
  );

  const addresses = useMemo(
    () => [
      {
        id: 1,
        name: "Home",
        address: "123 Main Street, Downtown, NY",
        phone: "+1 234 567 8900",
        isDefault: true,
      },
      {
        id: 2,
        name: "Office",
        address: "456 Business Ave, Midtown, NY",
        phone: "+1 987 654 3210",
        isDefault: false,
      },
    ],
    []
  );

  const wishlist = useMemo(
    () => [
      {
        id: "1",
        title: "Premium Cotton T-Shirt",
        price: 299000,
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      },
      {
        id: "2",
        title: "Slim Fit Jeans",
        price: 599000,
        img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
      },
      {
        id: "3",
        title: "White Sneakers",
        price: 899000,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      },
      {
        id: "4",
        title: "White Sneakers",
        price: 899000,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      },
      {
        id: "5",
        title: "White Sneakers",
        price: 899000,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      },
      {
        id: "6",
        title: "White Sneakers",
        price: 899000,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      },
      {
        id: "7",
        title: "White Sneakers",
        price: 899000,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      },
    ],
    []
  );

  const renderTab = () => {
    switch (activeTab) {
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
        return <OrdersTab orders={orders} />;
      case "addresses":
        return <AddressesTab addresses={addresses} />;
      case "wishlist":
        return (
          <WishlistTab
            items={wishlist.map((item) => ({
              id: item.id,
              title: item.title,
              img: item.img,
              salePrice: item.price,
              regularPrice: item.price,
              stock: 10,
            }))}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-2 py-8 mx-auto max-w-7xl sm:px-6 md:px-16">
      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {showSidebar && (
          <div className="w-full lg:w-1/4">
            <AccountSidebar
              profile={profile}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={() => console.log("Logout")}
            />
          </div>
        )}

        {(!isMobile || !showSidebar) && tab && (
          <div className="w-full lg:w-3/4">
            {isMobile && (
              <div className="flex justify-start mb-1">
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
