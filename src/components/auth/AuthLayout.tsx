// src/layouts/AuthLayout.tsx
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function AuthLayout({
  children,
  title = "Welcome Back",
  subtitle = "Log in to continue exploring your personalized experience.",
  image = "/auth-bg.jpg",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-gradient-to-br from-orange-100 via-white to-pink-100 overflow-hidden">
      {/* Right side - chỉ hiển thị trên desktop */}
      <div className="hidden lg:flex lg:w-1/3 relative">
        <img
          src={image}
          alt="Auth background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-white p-10 xl:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg text-orange-50/90 mb-6 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Left side */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-5 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-white to-orange-50">
        {children}
      </div>
    </div>
  );
}
