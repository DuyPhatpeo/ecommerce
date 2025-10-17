import React from "react";

interface SectionBannerProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
  bgColor?: string;
  height?: string;
}

const SectionBanner: React.FC<SectionBannerProps> = ({
  title,
  subtitle,
  bgImage,
  bgColor = "bg-orange-500",
  height = "h-[350px]",
}) => {
  return (
    <div
      className={`relative ${height} w-full flex items-center justify-start overflow-hidden`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        marginTop: 0,
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${bgImage ? "bg-black/30" : bgColor}`}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-white px-10 md:px-20 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default SectionBanner;
