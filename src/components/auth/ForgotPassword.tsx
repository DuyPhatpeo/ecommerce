import { useState } from "react";
import { Mail, ArrowLeft, Home, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    // Gửi yêu cầu reset mật khẩu (API)
    alert(`Password reset link sent to: ${email}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src="/auth-bg.jpg"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-md">
            Forgot Password?
          </h1>
          <p className="text-xl text-orange-50 mb-8 leading-relaxed drop-shadow-sm">
            Enter your email and we will send you a link to reset your password.
          </p>
          <div className="flex justify-center gap-2 mt-12">
            <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
            <div className="w-8 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 group border border-gray-100"
            >
              <Home
                size={18}
                className="text-gray-600 group-hover:text-orange-600 transition-colors"
              />
              <span className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                Home
              </span>
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg transition-all duration-200 text-white"
            >
              <span className="font-medium">Sign In</span>
              <ArrowLeft size={18} className="rotate-180" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Reset Password
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your email below and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-5"
          >
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
            >
              <Send size={20} />
              Send Reset Link
            </button>

            {/* Back to Sign In */}
            <p className="text-center text-sm text-gray-600 pt-4">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
            By requesting a password reset, you agree to our{" "}
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
