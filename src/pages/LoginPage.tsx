import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <AuthLayout>
      {/* LEFT */}
      <div className="w-full lg:w-3/5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 h-full">
        <div className="flex justify-center lg:justify-start">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-xl"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center mt-4 sm:mt-6">
          <LoginForm />

          <div className="text-center text-sm mt-4">
            <span>Chưa có tài khoản? </span>
            <Link to="/register" className="text-orange-600 font-semibold">
              Đăng ký ngay
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          © 2025 YourShop. All rights reserved.
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex lg:w-2/5 relative text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 p-10 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <LogIn size={56} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-base text-white/90 leading-relaxed max-w-sm">
            Sign in to continue shopping with us.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
