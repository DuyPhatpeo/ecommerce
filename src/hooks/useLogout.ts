import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const useLogout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(() => {
    const stored = localStorage.getItem("userId");
    return stored ? JSON.parse(stored) : null;
  });

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userId") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
  };

  return { user, setUser, logout };
};
