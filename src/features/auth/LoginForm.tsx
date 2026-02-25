import { useState, useEffect } from "react";
import { FiMail, FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Lấy state và action từ Zustand
  const {
    loginForm,
    loginErrors,
    loginLoading,
    rememberMe,
    setLoginForm,
    setRememberMe,
    login,
  } = useAuthStore();

  // 🔹 Đồng bộ email với localStorage khi có rememberMe
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("email");
    if (savedRememberMe && savedEmail) {
      setRememberMe(true);
      setLoginForm({ email: savedEmail });
    }
  }, [setRememberMe, setLoginForm]);

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ [name]: value });
  };

  // 🔹 Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(navigate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Email */}
      <InputField
        label="Email Address"
        name="email"
        type="email"
        value={loginForm.email}
        onChange={handleChange}
        placeholder="you@example.com"
        icon={<FiMail size={20} />}
        error={loginErrors.email}
      />

      {/* Password */}
      <PasswordField
        label="Password"
        name="password"
        value={loginForm.password}
        onChange={handleChange}
        placeholder="Enter your password"
        show={showPassword}
        toggle={() => setShowPassword(!showPassword)}
        error={loginErrors.password}
      />

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between text-sm mt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-gray-600">Remember me</span>
        </label>

        <button
          type="button"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={loginLoading}
        icon={<FiLogIn size={20} />}
        label={loginLoading ? "Signing in..." : "Sign In"}
        justify="center"
        className={`w-full py-3.5 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all ${
          loginLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:-translate-y-0.5"
        }`}
      />

      {/* OR separator */}
      <div className="relative text-center my-3">
        <span className="absolute inset-x-0 top-1/2 border-t border-gray-200"></span>
        <span className="relative bg-white px-4 text-sm text-gray-500">OR</span>
      </div>

      {/* Google login button */}
      <Button
        type="button"
        onClick={() => (window.location.href = "https://accounts.google.com")}
        label="Sign in with Google"
        justify="center"
        className="w-full border-2 border-orange-200 bg-white hover:bg-orange-50 text-gray-700 font-medium py-3.5 rounded-xl flex items-center gap-3 transition-all"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 20 20"
          >
            <path
              d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10V12.05H15.5091C15.2727 13.3 14.5636 14.3591 13.5 15.0682V17.5773H16.7818C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z"
              fill="#4285F4"
            />
            <path
              d="M10 20C12.7 20 14.9636 19.1045 16.7818 17.5773L13.5 15.0682C12.6091 15.6682 11.4818 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.01364V14.4909C2.81818 18.0682 6.10909 20 10 20Z"
              fill="#34A853"
            />
            <path
              d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.01364C0.340909 6.85909 0 8.38636 0 10C0 11.6136 0.340909 13.1409 1.01364 14.4909L4.40455 11.9Z"
              fill="#FBBC05"
            />
            <path
              d="M10 3.97727C11.6136 3.97727 13.0636 4.54091 14.2045 5.62727L17.1227 2.70909C14.9591 0.681818 12.6955 0 10 0C6.10909 0 2.81818 1.93182 1.01364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z"
              fill="#EA4335"
            />
          </svg>
        }
      />
    </form>
  );
}
