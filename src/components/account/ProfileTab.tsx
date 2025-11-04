import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../../api/authApi";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";
import { User, Phone, Mail } from "lucide-react";

interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}

const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await getUserProfile(userId);
        setProfile(res.data);
        setEditedProfile(res.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user information.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("User not found.");

    try {
      const res = await updateUserProfile(userId, editedProfile);
      setProfile(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }

    if (!passwords.current || !passwords.new) {
      return toast.error("Please fill in all password fields.");
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("User not found.");

    try {
      await changeUserPassword(userId, passwords.current, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update password."
      );
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Title */}
        <div className="mb-10 text-center border-b border-orange-100 pb-4">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Personal Information
          </h2>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Account Details
          </h3>
          {!isEditing ? (
            <Button
              label="Edit"
              onClick={handleEdit}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            />
          ) : (
            <div className="flex gap-2">
              <Button
                label="Save"
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              />
              <Button
                label="Cancel"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              />
            </div>
          )}
        </div>

        {/* Email (disabled) */}
        <div className="mb-6">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={() => {}}
            placeholder="Enter your email"
            icon={<Mail size={18} />}
            disabled
          />
        </div>

        {/* Full Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="fullName"
            value={editedProfile.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            icon={<User size={18} />}
            disabled={!isEditing}
          />
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={editedProfile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            icon={<Phone size={18} />}
            disabled={!isEditing}
          />
        </div>

        {/* Change Password */}
        <div className="mt-8 border-t border-orange-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Change Password
            </h3>
            <Button
              label="Change"
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            />
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 border-b border-gray-100 pb-2">
                  Update Password
                </h3>

                <div className="space-y-5 mt-4">
                  <PasswordField
                    label="Current Password"
                    name="current"
                    value={passwords.current}
                    show={showPassword.current}
                    toggle={() =>
                      setShowPassword((p) => ({ ...p, current: !p.current }))
                    }
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />

                  <PasswordField
                    label="New Password"
                    name="new"
                    value={passwords.new}
                    show={showPassword.new}
                    toggle={() =>
                      setShowPassword((p) => ({ ...p, new: !p.new }))
                    }
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />

                  <PasswordField
                    label="Confirm New Password"
                    name="confirm"
                    value={passwords.confirm}
                    show={showPassword.confirm}
                    toggle={() =>
                      setShowPassword((p) => ({ ...p, confirm: !p.confirm }))
                    }
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    label="Confirm"
                    onClick={handlePasswordUpdate}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  />
                  <Button
                    label="Cancel"
                    onClick={() => {
                      setShowModal(false);
                      setPasswords({ current: "", new: "", confirm: "" });
                    }}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileTab;
