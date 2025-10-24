import { useState } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Phone,
  Home,
} from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registration successful!");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col md:flex-row">
      {/* Left Column - Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src="/auth-bg.jpg"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Làm mờ nhẹ, sáng hơn */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-white p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl mb-6 shadow-2xl">
              <UserPlus className="text-white" size={40} />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-md">
            Join Our Community
          </h1>
          <p className="text-xl text-orange-50 mb-8 leading-relaxed drop-shadow-sm">
            Create your account and start your amazing journey with thousands of
            users worldwide.
          </p>

          <div className="flex justify-center gap-2 mt-12">
            <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
            <div className="w-8 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-8">
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 group border border-gray-100"
            >
              <Home
                size={18}
                className="text-gray-600 group-hover:text-orange-600 transition-colors"
              />
              <span className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                Home
              </span>
            </a>

            <a
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg transition-all duration-200 text-white"
            >
              <span className="font-medium">Sign In</span>
              <ArrowLeft size={18} className="rotate-180" />
            </a>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Create Account
            </h1>
            <p className="text-gray-600 text-lg">
              Join us and start your journey today.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

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
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+84 123 456 789"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                />
              </div>
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
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <label className="text-sm text-gray-600 leading-relaxed">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
            >
              <UserPlus size={20} />
              Create Account
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 pt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-orange-600 hover:underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-600 hover:underline font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
