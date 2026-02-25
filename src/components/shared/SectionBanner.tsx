import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

interface SectionBannerProps {
  title: string;
  bgImage?: string;
  bgColor?: string;
  height?: string;
}

const SectionBanner: React.FC<SectionBannerProps> = ({
  title,
  bgImage,
  bgColor = "bg-gray-900",
  height = "h-[150px]",
}) => {
  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden 
  ${height} sm:h-[180px] md:h-[280px] lg:h-[300px] pt-20`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Darker overlay for depth */}
      <div
        className={`absolute inset-0 ${bgImage ? "bg-black/50" : bgColor}`}
      ></div>

      <div className="relative z-10 px-4 mx-auto text-center text-white max-w-7xl sm:px-6 md:px-16">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center gap-1.5 text-sm text-white/60 mb-3"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </Link>
          <FiChevronRight size={14} />
          <span className="text-white font-medium">{title}</span>
        </nav>

        {/* Title */}
        <h1
          className="
            text-2xl font-bold leading-snug sm:text-3xl md:text-5xl lg:text-6xl 
            tracking-tight uppercase
          "
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default SectionBanner;
