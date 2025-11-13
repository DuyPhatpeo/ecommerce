import React, { useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  X,
  Edit3,
  Check,
  XCircle,
  Key,
  Save,
} from "lucide-react";

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

  // Khóa cuộn và lắng nghe ESC
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        setPasswords({ current: "", new: "", confirm: "" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, setShowModal, setPasswords]);

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
              <User className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Personal Information
              </h2>
              <p className="text-xs text-gray-600 sm:text-sm">
                Manage your account details
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isEditing ? (
            <Button
              label="Edit"
              icon={<Edit3 size={16} />}
              onClick={handleEdit}
              className="w-full px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5 sm:w-auto"
            />
          ) : (
            <div className="flex gap-2">
              <Button
                label="Save"
                icon={<Check size={16} />}
                onClick={handleSave}
                className="flex-1 px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-green-200 hover:-translate-y-0.5 sm:flex-none"
              />
              <Button
                label="Cancel"
                icon={<XCircle size={16} />}
                onClick={handleCancel}
                className="flex-1 px-5 py-2.5 font-semibold text-gray-700 transition-all duration-300 bg-gray-100 rounded-xl hover:bg-gray-200 sm:flex-none"
              />
            </div>
          )}
        </div>

        {/* Account Details Section */}
        <div className="mb-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Mail className="text-orange-500" size={16} />
            <h3 className="text-sm font-bold text-gray-800 sm:text-base">
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
            <div className="absolute top-0 right-0 px-2.5 py-1 text-xs font-semibold text-orange-600 rounded-full bg-orange-50 sm:px-3">
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Lock className="text-blue-500 flex-shrink-0" size={16} />
              <div>
                <h3 className="text-sm font-bold text-gray-800 sm:text-base">
                  Security Settings
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm">
                  Keep your account secure
                </p>
              </div>
            </div>

            <Button
              label="Change Password"
              icon={<Key size={16} />}
              onClick={() => setShowModal(true)}
              className="w-full px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5 sm:w-auto whitespace-nowrap"
            />
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-80 bg-black/60 backdrop-blur-md" />

          {/* Modal */}
          <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl sm:rounded-3xl max-h-[90vh] flex flex-col">
              {/* Header with gradient */}
              <div className="relative flex-shrink-0 p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white sm:w-12 sm:h-12 rounded-xl shadow-lg">
                      <Lock className="text-blue-600" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white sm:text-xl">
                        Change Password
                      </h3>
                      <p className="text-xs text-blue-100 sm:text-sm">
                        Update your security credentials
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      setPasswords({ current: "", new: "", confirm: "" });
                    }}
                    icon={<X size={18} />}
                    className="flex items-center justify-center flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10
             rounded-xl bg-white/15 text-white hover:bg-white/25 hover:scale-105
             transition-all duration-300"
                    aria-label="Close"
                  />
                </div>
              </div>

              {/* Form Content - Scrollable */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto sm:p-6 sm:space-y-5">
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
              <div className="flex items-center gap-3 p-4 border-t border-gray-100 bg-gray-50 sm:p-6">
                <Button
                  label="Cancel"
                  icon={<XCircle size={16} />}
                  onClick={() => {
                    setShowModal(false);
                    setPasswords({ current: "", new: "", confirm: "" });
                  }}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                />

                <Button
                  label="Update"
                  icon={<Save size={16} />}
                  onClick={handlePasswordUpdate}
                  className="flex-1 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-green-200 hover:-translate-y-0.5"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileTab;
