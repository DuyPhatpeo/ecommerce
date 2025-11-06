import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const useLogout = () => {
  const navigate = useNavigate();

  // ✅ userId chỉ là chuỗi, KHÔNG parse JSON
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId");
  });

  // 🔄 Đồng bộ giữa các tab
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userId") {
        setUserId(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ✅ Hàm logout
  const logout = () => {
    localStorage.removeItem("userId"); // chỉ xoá userId
    setUserId(null);
    navigate("/login");
  };

  return { userId, setUserId, logout };
};
