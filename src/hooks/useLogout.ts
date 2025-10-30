// hooks/useLogout.ts
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useLogout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const logout = () => {
    // 🔹 Xóa user khỏi localStorage
    localStorage.removeItem("user");
    setUser(null);
    // 🔹 Redirect về trang home
    navigate("/");
  };

  return { user, setUser, logout };
};
