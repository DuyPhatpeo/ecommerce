import React from "react";

interface SectionBannerProps {
  title: string;
  bgImage?: string;
  bgColor?: string;
  height?: string;
}

const SectionBanner: React.FC<SectionBannerProps> = ({
  title,
  bgImage,
  bgColor = "bg-orange-500",
  height = "h-[150px]",
}) => {
  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden 
  ${height} sm:h-[150px] md:h-[300px] lg:h-[300px] xl:h-[300px] pt-20`}
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
        <h1
          className="
            mb-3 text-2xl font-bold leading-snug sm:text-3xl md:text-5xl lg:text-6xl 
            overflow-hidden text-ellipsis line-clamp-2
          "
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default SectionBanner;
