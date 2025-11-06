import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers } from "../api/authApi"; // Firestore version

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function useLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* ==========================
     🔹 Load email đã lưu (nếu có)
  ========================== */
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("email");

    if (savedRememberMe && savedEmail) {
      setRememberMe(true);
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  /* ==========================
     🔹 Handle input change
  ========================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ==========================
     🔹 Validate form
  ========================== */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { email, password } = formData;

    if (!email.trim()) newErrors.email = "Email là bắt buộc.";
    if (!password.trim()) newErrors.password = "Mật khẩu là bắt buộc.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email))
      newErrors.email = "Định dạng email không hợp lệ.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ==========================
     🔹 Handle login (Firestore)
  ========================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🔸 Lấy toàn bộ người dùng từ Firestore
      const users = await getUsers();

      // 🔸 Tìm user theo email (không phân biệt hoa/thường)
      const user = users.find(
        (u) =>
          u.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (!user) {
        toast.error("Email không tồn tại trong hệ thống.");
        return;
      }

      if (user.password !== formData.password) {
        toast.error("Mật khẩu không chính xác.");
        return;
      }

      const displayName = user.fullName || user.email;

      // ✅ Ghi nhớ email nếu chọn “Remember Me”
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      // ✅ Lưu userId (giữ cố định)
      if (!user.id) {
        console.warn("⚠️ User không có field `id` trong Firestore!");
        toast.error("Không tìm thấy ID người dùng trong Firestore.");
        return;
      }

      localStorage.setItem("userId", user.id);

      toast.success(`Chào mừng trở lại, ${displayName}! 🎉`);
      setFormData({ email: "", password: "" });

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    rememberMe,
    setRememberMe,
    handleChange,
    handleSubmit,
  };
}
