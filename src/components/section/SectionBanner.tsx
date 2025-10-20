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
      className={`relative w-full flex items-center justify-start overflow-hidden 
      ${height} sm:h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px]`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${bgImage ? "bg-black/30" : bgColor}`}
      ></div>

      {/* Content */}
      <div
        className="relative z-10 text-white 
        px-4 sm:px-6 md:px-10 lg:px-20 
        pt-[4rem] sm:pt-[5rem] md:pt-[6rem] lg:pt-[7rem]
        pb-12 sm:pb-14 md:pb-20 lg:pb-28"
      >
        <h1
          className="font-bold mb-3 
          text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
          leading-tight
          overflow-hidden text-ellipsis line-clamp-2"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl 
            opacity-90 max-w-xl sm:max-w-2xl
            overflow-hidden text-ellipsis line-clamp-3"
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionBanner;
