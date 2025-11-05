import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Lock, X } from "lucide-react";
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
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600">
                Manage your account details
              </p>
            </div>
          </div>

          {!isEditing ? (
            <Button
              label="Edit"
              onClick={handleEdit}
              className="px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            />
          ) : (
            <div className="flex gap-2">
              <Button
                label="Save"
                onClick={handleSave}
                className="px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-green-200 hover:-translate-y-0.5"
              />
              <Button
                label="Cancel"
                onClick={handleCancel}
                className="px-5 py-2.5 font-semibold text-gray-700 transition-all duration-300 bg-gray-100 rounded-xl hover:bg-gray-200"
              />
            </div>
          )}
        </div>

        {/* Account Details Section */}
        <div className="mb-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-orange-500" size={18} />
            <h3 className="text-base font-bold text-gray-800">
              Account Details
            </h3>
          </div>

          {/* Email Field */}
          <div className="relative">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={profile.email}
              onChange={() => {}}
              placeholder="Enter your email"
              icon={<Mail size={18} />}
              disabled
            />
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-orange-600 rounded-full bg-orange-50">
              Verified
            </div>
          </div>

          {/* Name & Phone Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        {/* Security Section */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="text-blue-500" size={18} />
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Security Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Keep your account secure
                </p>
              </div>
            </div>

            <Button
              label="Change Password"
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5"
            />
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModal(false);
                setPasswords({ current: "", new: "", confirm: "" });
              }}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-3xl">
                {/* Header with gradient */}
                <div className="relative p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg">
                        <Lock className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Change Password
                        </h3>
                        <p className="text-sm text-blue-100">
                          Update your security credentials
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setPasswords({ current: "", new: "", confirm: "" });
                      }}
                      className="flex items-center justify-center w-10 h-10 transition-all duration-300 bg-white/20 rounded-xl hover:bg-white/30"
                    >
                      <X className="text-white" size={20} />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-5">
                  {["current", "new", "confirm"].map((field) => (
                    <div key={field}>
                      <PasswordField
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
                          setPasswords((p) => ({
                            ...p,
                            [field]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
                  <Button
                    label="Update Password"
                    onClick={handlePasswordUpdate}
                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-green-200 hover:-translate-y-0.5"
                  />
                  <Button
                    label="Cancel"
                    onClick={() => {
                      setShowModal(false);
                      setPasswords({ current: "", new: "", confirm: "" });
                    }}
                    className="px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
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
