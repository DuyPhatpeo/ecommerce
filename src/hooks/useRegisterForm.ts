import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers, registerUser } from "../api/userApi";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await getUsers();
      const existingUser = res.data.find(
        (u: any) => u.email === formData.email.trim()
      );
      if (existingUser) {
        toast.error("Email already exists.");
        return;
      }

      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };

      await registerUser(newUser);
      toast.success("Account created successfully! 🎉 Redirecting...");

      // 👉 Reset form rồi chuyển hướng ngay
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Chuyển sang trang login sau 1s để toast hiển thị rõ
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, handleChange, handleSubmit };
}
