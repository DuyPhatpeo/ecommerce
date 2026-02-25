import React, { useEffect } from "react";

import {
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiX,
  FiEdit3,
  FiCheck,
  FiXCircle,
  FiKey,
  FiSave,
} from "react-icons/fi";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import { useUserStore } from "../../stores/userStore";

const ProfileTab: React.FC = () => {
  const {
    profile,
    editedProfile,
    isEditing,
    showModal,
    showPassword,
    passwords,
    loading,
    fetchProfile,
    setShowModal,
    setShowPassword,
    setPasswords,
    resetPasswordForm,
    handleChangeProfile,
    handleEdit,
    handleCancel,
    handleSave,
    handlePasswordUpdate,
  } = useUserStore();

  const userId = localStorage.getItem("userId") || "";

  // Fetch profile on mount
  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

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
        resetPasswordForm();
      } else if (e.key === "Enter" && showModal && !e.shiftKey) {
        e.preventDefault();
        handlePasswordUpdate(userId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    showModal,
    userId,
    setShowModal,
    resetPasswordForm,
    handlePasswordUpdate,
  ]);

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[#f8f6f3] opacity-50" />

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 shadow-md shadow-orange-100">
              <FiUser className="text-orange-500" size={18} />
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
              icon={<FiEdit3 size={16} />}
              onClick={handleEdit}
              disabled={loading.profile}
              className="w-full px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-md bg-gray-900 rounded-xl hover:bg-orange-500 hover:shadow-orange-500/30 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ) : (
            <div className="flex gap-2">
              <Button
                label={loading.update ? "Saving..." : "Save"}
                icon={<FiCheck size={16} />}
                onClick={() => handleSave(userId)}
                disabled={loading.update}
                className="flex-1 px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-md bg-green-600 rounded-xl hover:bg-green-700 hover:shadow-green-500/30 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                label="Cancel"
                icon={<FiXCircle size={16} />}
                onClick={handleCancel}
                disabled={loading.update}
                className="flex-1 px-5 py-2.5 font-semibold text-gray-700 transition-all duration-300 bg-gray-100 rounded-xl hover:bg-gray-200 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading.profile ? (
          <div className="py-16 text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 rounded-xl animate-spin border-t-orange-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your profile...
            </p>
          </div>
        ) : (
          <>
            {/* Account Details Section */}
            <div className="mb-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FiMail className="text-orange-500" size={16} />
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
                  icon={<FiMail size={18} />}
                  disabled
                />
                <div className="absolute top-0 right-0 px-2.5 py-1 text-xs font-semibold text-gray-700 rounded-md bg-gray-100 sm:px-3">
                  Verified
                </div>
              </div>

              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={editedProfile.fullName}
                  onChange={(e) =>
                    handleChangeProfile("fullName", e.target.value)
                  }
                  placeholder="Enter your full name"
                  icon={<FiUser size={18} />}
                  disabled={!isEditing}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleChangeProfile("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  icon={<FiPhone size={18} />}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <FiLock className="text-blue-500 flex-shrink-0" size={16} />
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
                  icon={<FiKey size={16} />}
                  onClick={() => setShowModal(true)}
                  className="w-full px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-md bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-blue-500/30 sm:w-auto whitespace-nowrap"
                />
              </div>
            </div>
          </>
        )}
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
              <div className="relative flex-shrink-0 p-4 sm:p-6 bg-blue-600">
                <div className="absolute inset-0 opacity-10 bg-white" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white sm:w-12 sm:h-12 rounded-xl shadow-lg">
                      <FiLock className="text-blue-600" size={20} />
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
                      resetPasswordForm();
                    }}
                    icon={<FiX size={18} />}
                    className="flex items-center justify-center flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10
             rounded-xl bg-white/15 text-white hover:bg-white/25 hover:scale-105
             transition-all duration-300"
                    aria-label="Close"
                  />
                </div>
              </div>

              {/* Form Content - Scrollable */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto sm:p-6 sm:space-y-5">
                <PasswordField
                  label="Current Password"
                  name="current"
                  value={passwords.current}
                  show={showPassword.current}
                  toggle={() =>
                    setShowPassword("current", !showPassword.current)
                  }
                  onChange={(e) => setPasswords("current", e.target.value)}
                  placeholder="Enter current password"
                />

                <PasswordField
                  label="New Password"
                  name="new"
                  value={passwords.new}
                  show={showPassword.new}
                  toggle={() => setShowPassword("new", !showPassword.new)}
                  onChange={(e) => setPasswords("new", e.target.value)}
                  placeholder="Enter new password"
                  error={
                    passwords.new && passwords.new.length < 6
                      ? "Password must be at least 6 characters"
                      : passwords.new &&
                          passwords.current &&
                          passwords.current === passwords.new
                        ? "Must be different from current password"
                        : undefined
                  }
                />

                <PasswordField
                  label="Confirm New Password"
                  name="confirm"
                  value={passwords.confirm}
                  show={showPassword.confirm}
                  toggle={() =>
                    setShowPassword("confirm", !showPassword.confirm)
                  }
                  onChange={(e) => setPasswords("confirm", e.target.value)}
                  placeholder="Confirm new password"
                  error={
                    passwords.confirm && passwords.new !== passwords.confirm
                      ? "Passwords do not match"
                      : undefined
                  }
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-3 p-4 border-t border-gray-100 bg-gray-50 sm:p-6">
                <Button
                  label="Cancel"
                  icon={<FiXCircle size={16} />}
                  onClick={() => {
                    setShowModal(false);
                    resetPasswordForm();
                  }}
                  disabled={loading.password}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <Button
                  label={loading.password ? "Updating..." : "Update"}
                  icon={<FiSave size={16} />}
                  onClick={() => handlePasswordUpdate(userId)}
                  disabled={loading.password}
                  className="flex-1 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-md bg-gray-900 rounded-xl hover:bg-orange-500 hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
