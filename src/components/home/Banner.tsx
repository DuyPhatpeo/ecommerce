import React, { useState } from "react";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";

const Banner: React.FC = () => {
  const banners = [
    {
      title: "Nike New Collection!",
      description:
        "Khám phá bộ sưu tập mới nhất kết hợp giữa phong cách thể thao và hiện đại. Thoải mái, nhẹ nhàng và nổi bật với phong cách riêng của bạn.",
      productImage: "/banner-img.png",
    },
    {
      title: "Air Jordan Retro Series",
      description:
        "Trở lại với phong cách cổ điển nhưng mang hơi thở hiện đại. Giới hạn số lượng, dành cho người thật sự đam mê.",
      productImage: "/banner-img.png",
    },
    {
      title: "Run Faster, Go Further!",
      description:
        "Khám phá giày chạy bộ mới nhất — nhẹ, êm và bền hơn bao giờ hết. Cảm nhận tốc độ trong từng bước.",
      productImage: "/banner-img.png",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const bgImage = "/banner-bg.jpg";

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    }),
  };

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={banners[current].title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col lg:flex-row items-center justify-between gap-10"
          >
            {/* LEFT CONTENT */}
            <div className="max-w-xl text-center lg:text-left">
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {banners[current].title}
              </motion.h1>

              <motion.p
                className="mt-6 text-gray-600 text-base md:text-lg"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {banners[current].description}
              </motion.p>

              <motion.div
                className="mt-10 flex items-center justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="button"
                  icon={<Plus size={22} className="text-white" />}
                  label="ADD TO BAG"
                  className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 rounded-full shadow-lg text-white font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                />
              </motion.div>
            </div>

            {/* RIGHT IMAGE */}
            <motion.div
              className="relative w-full lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, rotate: -10, y: 40 }}
              animate={{ opacity: 1, rotate: -5, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <motion.img
                src={banners[current].productImage}
                alt={banners[current].title}
                className="max-w-[600px] w-full drop-shadow-2xl transition-transform duration-700 ease-in-out"
                whileHover={{ scale: 1.1, rotate: 0 }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4 z-30">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-orange-500 shadow transition duration-300"
        >
          <ArrowLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-orange-500 shadow transition duration-300"
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </section>
  );
};

export default Banner;
