import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function BrandStrip() {
  const swiperRef = useRef(null);

  const brands = [
    "https://logos-world.net/wp-content/uploads/2020/06/Nike-Logo-500x281.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Air-Jordan-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/06/Converse-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/09/New-Balance-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/06/Vans-Logo-500x281.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Supreme-Logo.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/03/Asics-Logo-700x394.png",
  ];

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <section className="bg-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-8">
          Trusted by Leading Brands
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={2}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 6,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="brand-swiper"
        >
          {brands.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="flex justify-center items-center h-full">
                <img
                  src={src}
                  alt={`brand-${i}`}
                  className="h-12 sm:h-14 md:h-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
