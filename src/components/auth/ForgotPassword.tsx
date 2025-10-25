import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert(`Password reset link sent to: ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-orange-100 via-white to-pink-100">
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src="/auth-bg.jpg"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-white p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Forgot Password?
          </h1>
          <p className="text-lg text-orange-50/90 mb-8 leading-relaxed">
            Enter your email and we’ll send you a link to reset your password.
          </p>
          <div className="flex justify-center gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-8 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 relative bg-gradient-to-br from-white to-orange-50">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              We’ll send you a link to create a new password.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_24px_rgba(255,111,0,0.15)] p-6 border border-orange-100 space-y-5"
          >
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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Reset Link
            </button>

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
        </div>
      </div>
    </div>
  );
}
