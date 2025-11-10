import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../api/authApi";

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
}

export const useProfile = () => {
  const userId = localStorage.getItem("userId") || "";

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

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(userId);
        const safeData: UserProfile = {
          id: res.id,
          fullName: res.fullName || "",
          email: res.email || "",
          phone: res.phone || "",
        };
        setProfile(safeData);
        setEditedProfile(safeData);
      } catch {
        toast.error("Failed to load user information.");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChangeProfile = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userId) return toast.error("User not found.");

    const updates: Partial<UserProfile> = {};
    (Object.keys(editedProfile) as (keyof UserProfile)[]).forEach((key) => {
      if (editedProfile[key] !== profile[key])
        updates[key] = editedProfile[key];
    });

    if (!Object.keys(updates).length) return toast("No changes detected.");

    try {
      await updateUserProfile(userId, updates);
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      setEditedProfile(newProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm)
      return toast.error("Please fill in all password fields.");
    if (passwords.new !== passwords.confirm)
      return toast.error("New passwords do not match.");
    if (!userId) return toast.error("User not found.");

    try {
      await changeUserPassword(userId, passwords.current, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password.");
    }
  };

  return {
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
  };
};
