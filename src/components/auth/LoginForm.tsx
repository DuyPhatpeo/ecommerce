// src/components/auth/LoginForm.tsx
import { useState } from "react";
import { LogIn, Mail } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import useLoginForm from "../../hooks/useLoginForm";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formData,
    errors,
    loading,
    rememberMe,
    setRememberMe,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  const handleGoogleSignIn = () => {
    alert("Đăng nhập Google (OAuth 2.0) sẽ được thêm tại đây!");
  };

  return (
    <div className="w-full max-w-md space-y-6 sm:space-y-8">
      <Toaster position="top-center" />

      {/* Logo */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <Link to="/" className="inline-flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 sm:w-32 h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_24px_rgba(255,111,0,0.15)] p-5 sm:p-6 md:p-8 border border-orange-100 space-y-4 sm:space-y-5"
      >
        <InputField
          label="Email Address"
          name="email"
          icon={<Mail size={18} />}
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

        {/* Remember me */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm mb-2 sm:mb-3">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In button */}
        <Button
          type="submit"
          disabled={loading}
          icon={<LogIn size={18} />}
          label={loading ? "Signing in..." : "Sign In"}
          className={`w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 py-3 sm:py-4">
          <div className="flex-1 border-t border-gray-300" />
          <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
            Or continue with
          </span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2 sm:gap-3 transition-all text-sm sm:text-base"
        >
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
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
