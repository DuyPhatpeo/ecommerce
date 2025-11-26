import { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

import type { Swiper as SwiperClass } from "swiper";

export default function BrandStrip() {
  const swiperRef = useRef<SwiperClass | null>(null);

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
    swiperRef.current?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay?.start();
  };

  // Animation variants - Fixed easing types
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  const swiperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.3, duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white py-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 relative">
        {/* Animated Title */}
        <motion.h2
          variants={titleVariants}
          className="text-center text-2xl md:text-3xl font-extrabold leading-snug mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 relative"
        >
          Trusted by Leading Brands
          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
          />
        </motion.h2>

        {/* Animated Swiper Container */}
        <motion.div
          variants={swiperVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            loop
            speed={3000}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 6 },
              768: { slidesPerView: 3, spaceBetween: 8 },
              1024: { slidesPerView: 4, spaceBetween: 10 },
              1280: { slidesPerView: 5, spaceBetween: 12 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="brand-swiper"
          >
            {brands.map((src, i) => (
              <SwiperSlide
                key={i}
                className="flex justify-center items-center p-2"
              >
                <motion.div
                  variants={logoVariants}
                  className="flex justify-center items-center h-full"
                >
                  <motion.img
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.3 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    src={src}
                    alt={`brand-${i}`}
                    className="h-12 sm:h-14 md:h-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Decorative animated elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute top-4 left-4 w-32 h-32 bg-orange-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-4 right-4 w-32 h-32 bg-red-400 rounded-full blur-3xl"
        />
      </div>
    </motion.section>
  );
}
