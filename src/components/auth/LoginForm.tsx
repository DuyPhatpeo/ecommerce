import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Điều hướng React Router
import { Eye, EyeOff, LogIn, Mail, Lock, Home, ArrowLeft } from "lucide-react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
);

export default function LoginForm() {
  const navigate = useNavigate(); // ✅ NEW

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Login successful! \nEmail: ${formData.email}`);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign In would be implemented here with OAuth 2.0");
  };

  const handleNavigation = (path) => navigate(path); // ✅ Thay alert bằng navigate

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col md:flex-row">
      {/* Left section giữ nguyên */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src="/auth-bg.jpg"
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-white p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-md">
            Welcome Back!
          </h1>
          <p className="text-xl text-orange-50 mb-8 drop-shadow-sm">
            Sign in to access your account and continue your amazing journey
            with us.
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-md hover:shadow-lg group"
            >
              <Home
                size={18}
                className="text-gray-600 group-hover:text-orange-600"
              />
              <span className="font-medium text-gray-700 group-hover:text-orange-600">
                Home
              </span>
            </button>

            <button
              onClick={() => handleNavigation("/register")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
            >
              <span className="font-medium">Sign Up</span>
              <ArrowLeft size={18} className="rotate-180" />
            </button>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-3">Sign In</h1>
          <p className="text-gray-600 text-lg mb-8">
            Welcome back! Please enter your email and password.
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8  space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => handleNavigation("/forgot-password")}
                  className="text-sm text-orange-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>

            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 border-t" />
              <span className="text-sm text-gray-500 font-medium">
                Or continue with
              </span>
              <div className="flex-1 border-t" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 shadow-sm flex items-center justify-center gap-3"
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-600 pt-4">
              Don't have an account?
              <button
                onClick={() => handleNavigation("/register")}
                className="text-orange-600 hover:underline font-semibold ml-1"
              >
                Sign up for free
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
