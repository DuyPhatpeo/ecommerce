import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail } from "lucide-react";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";
import { useProfile } from "../../hooks/useProfile";

const ProfileTab: React.FC = () => {
  const {
    profile,
    editedProfile,
    isEditing,
    showModal,
    showPassword,
    passwords,
    setShowModal,
    setShowPassword,
    setPasswords,
    handleChangeProfile,
    handleEdit,
    handleCancel,
    handleSave,
    handlePasswordUpdate,
  } = useProfile();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Title */}
        <div className="mb-10 text-center border-b border-orange-100 pb-4">
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
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

        {/* Email */}
        <InputField
          label="Email"
          name="email"
          type="email"
          value={profile.email}
          onChange={() => {}}
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          disabled
          className="mb-6"
        />

        {/* Full Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="fullName"
            value={editedProfile.fullName}
            onChange={(e) => handleChangeProfile("fullName", e.target.value)}
            placeholder="Enter your full name"
            icon={<User size={18} />}
            disabled={!isEditing}
          />
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={editedProfile.phone}
            onChange={(e) => handleChangeProfile("phone", e.target.value)}
            placeholder="Enter your phone number"
            icon={<Phone size={18} />}
            disabled={!isEditing}
          />
        </div>

        {/* Change Password */}
        <div className="mt-8 border-t border-orange-100 pt-6 flex items-center justify-between mb-4">
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
                  {["current", "new", "confirm"].map((field) => (
                    <PasswordField
                      key={field}
                      label={
                        field === "current"
                          ? "Current Password"
                          : field === "new"
                          ? "New Password"
                          : "Confirm New Password"
                      }
                      name={field}
                      value={passwords[field as keyof typeof passwords]}
                      show={showPassword[field as keyof typeof showPassword]}
                      toggle={() =>
                        setShowPassword((p) => ({
                          ...p,
                          [field]: !p[field as keyof typeof p],
                        }))
                      }
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, [field]: e.target.value }))
                      }
                    />
                  ))}
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
