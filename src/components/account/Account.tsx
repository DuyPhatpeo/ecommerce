import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";
import SettingsTab from "./SettingsTab";

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams(); // 👉 lấy param "tab" từ URL
  const activeTab = tab || "profile";

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const orders = [
    /* ... */
  ];
  const addresses = [
    /* ... */
  ];
  const wishlist = [
    /* ... */
  ];

  const handleTabChange = (tabId: string) => {
    navigate(`/account/${tabId}`); // 👉 chuyển URL
  };

  return (
    <div className="px-2 py-8 mx-auto max-w-7xl sm:px-6 md:px-16">
      <div className="flex gap-6">
        <div className="w-full h-full lg:w-1/4">
          <AccountSidebar
            profile={profile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={() => console.log("Logout")}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="p-6">
            {activeTab === "profile" && (
              <ProfileTab
                profile={profile}
                editedProfile={editedProfile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => {
                  setProfile(editedProfile);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                onChange={(field, value) =>
                  setEditedProfile({ ...editedProfile, [field]: value })
                }
              />
            )}
            {activeTab === "orders" && <OrdersTab orders={orders} />}
            {activeTab === "addresses" && (
              <AddressesTab addresses={addresses} />
            )}
            {activeTab === "wishlist" && (
              <WishlistTab
                items={wishlist.map((item) => ({
                  id: item.id,
                  title: item.name,
                  img: item.image,
                  salePrice: item.price,
                  regularPrice: item.price,
                  stock: 10,
                }))}
              />
            )}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
