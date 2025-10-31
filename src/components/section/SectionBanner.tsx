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
  height = "h-[220px]", // mặc định hợp lý
}) => {
  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden 
      ${height} sm:h-[260px] md:h-[300px] lg:h-[320px] xl:h-[300px]`} // responsive vừa đủ
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`absolute inset-0 ${bgImage ? "bg-black/30" : bgColor}`}
      ></div>
      <div className="relative z-10 px-2 mx-auto text-center text-white max-w-7xl sm:px-6 md:px-16">
        <h1 className="mb-3 overflow-hidden text-2xl font-bold leading-tight sm:text-3xl md:text-5xl lg:text-6xl text-ellipsis line-clamp-2">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl mx-auto overflow-hidden text-sm sm:text-base md:text-lg lg:text-xl opacity-90 text-ellipsis line-clamp-3">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionBanner;
