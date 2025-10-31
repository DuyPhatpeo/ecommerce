import { useState, useEffect, useMemo } from "react";
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

  // ✅ Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Điều hướng mặc định và xử lý ẩn/hiện sidebar
  useEffect(() => {
    if (!tab) {
      navigate("/account/profile", { replace: true });
      return;
    }
    setShowSidebar(!isMobile);
  }, [tab, isMobile, navigate]);

  // ✅ Cập nhật profile
  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleTabChange = (tabId: string) => navigate(`/account/${tabId}`);
  const handleBack = () => navigate("/account");

  // ✅ Data mẫu (có thể thay sau này bằng API)
  const orders = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `ORD-${String(i + 1).padStart(3, "0")}`,
        createdAt: "2025-10-25T10:30:00Z",
        status: i === 0 ? "Shipping" : "Completed",
        total: (Math.random() * 2_000_000 + 500_000).toFixed(0),
        items: Math.floor(Math.random() * 5) + 1,
      })),
    []
  );

  const addresses = useMemo(
    () => [
      {
        id: "1",
        name: "Home",
        address: "123 Main Street, Downtown, NY",
        phone: "+1 234 567 8900",
        isDefault: true,
      },
      {
        id: "2",
        name: "Office",
        address: "456 Business Ave, Midtown, NY",
        phone: "+1 987 654 3210",
        isDefault: false,
      },
    ],
    []
  );

  const wishlist = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: String(i + 1),
        title: ["Premium Cotton T-Shirt", "Slim Fit Jeans", "White Sneakers"][
          i % 3
        ],
        price: [299000, 599000, 899000][i % 3],
        img: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
        ][i % 3],
      })),
    []
  );

  // ✅ Render tab tương ứng
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
        {/* 🔹 Sidebar */}
        {showSidebar && (
          <div className="w-full lg:w-1/4">
            <AccountSidebar
              activeTab={tab || "profile"}
              onTabChange={handleTabChange}
              onLogout={logout}
            />
          </div>
        )}

        {/* 🔹 Content */}
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
