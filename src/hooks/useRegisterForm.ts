import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers, registerUser } from "../api/authApi";
import type { User } from "../api/authApi";

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function useRegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // <-- trạng thái đăng ký thành công

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // -----------------------------
  // Validate form
  // -----------------------------
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email))
      newErrors.email = "Invalid email format.";

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (phone && !phoneRegex.test(phone))
      newErrors.phone = "Invalid phone number.";

    if (password && password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Submit handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Lấy danh sách user hiện tại
      const res = await getUsers();
      const existingUser = res.data.find(
        (u) =>
          u.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (existingUser) {
        toast.error("Email already exists.");
        return;
      }

      // Tạo user mới
      const newUser: User = {
        id: Date.now(),
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "customer",
        avatar: "",
        createdAt: new Date().toISOString(),
      };

      await registerUser(newUser);
      toast.success("Account created successfully! 🎉");

      setSuccess(true); // đánh dấu đăng ký thành công

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Chuyển sang login ngay
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, success, handleChange, handleSubmit };
}
