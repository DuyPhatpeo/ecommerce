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
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const bgImage = "/banner-bg.jpg";

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.42, 0, 1, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
    }),
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col lg:flex-row items-center justify-between w-full"
          >
            {/* LEFT CONTENT */}
            <div className="max-w-xl text-center lg:text-left">
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
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
                className="mt-10 flex items-center justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="button"
                  icon={<Plus size={22} className="text-white" />}
                  label="ADD TO BAG"
                  className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 rounded-full shadow-lg text-white font-semibold hover:scale-110 transition-transform duration-300 flex items-center gap-2"
                />
              </motion.div>
            </div>

            {/* RIGHT CONTENT (Product Image) */}
            <motion.div
              className="relative w-full lg:w-1/2 flex justify-center mt-14 lg:mt-0 overflow-visible z-20"
              initial={{ opacity: 0, rotate: -10, y: 40 }}
              animate={{ opacity: 1, rotate: -6, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <motion.img
                src={banners[current].productImage}
                alt={banners[current].title}
                className="max-w-[700px] w-full drop-shadow-2xl transition-transform duration-700 ease-in-out"
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 50 }}
                style={{ position: "relative" }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="absolute bottom-6 right-6 flex items-center gap-6 z-30">
        <Button
          type="button"
          icon={<ArrowLeft size={24} />}
          label="Prev"
          onClick={prevSlide}
          className="flex flex-col items-center text-gray-700 hover:text-orange-500 transition duration-300 font-semibold"
        />
        <Button
          type="button"
          icon={<ArrowRight size={24} />}
          label="Next"
          onClick={nextSlide}
          className="flex flex-col items-center text-gray-700 hover:text-orange-500 transition duration-300 font-semibold"
        />
      </div>
    </section>
  );
};

export default Banner;
