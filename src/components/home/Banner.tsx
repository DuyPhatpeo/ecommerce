import React, { useEffect, useState } from "react";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, easeIn, easeOut } from "framer-motion";
import Button from "../ui/Button";

const Banner: React.FC = () => {
  const banners = [
    {
      title: "Nike New Collection!",
      description:
        "Discover the latest collection combining sporty style with modern design. Comfortable, lightweight, and stand out with your unique style.",
      productImage: "/banner-1.png",
    },
    {
      title: "Air Jordan Retro Series",
      description:
        "Return to a classic style with a modern touch. Limited edition, for true enthusiasts only.",
      productImage: "/banner-2.png",
    },
    {
      title: "Run Faster, Go Further!",
      description:
        "Explore the newest running shoes — lighter, softer, and more durable than ever. Feel the speed in every step.",
      productImage: "/banner-3.png",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      transition: { duration: 0.6, ease: easeOut },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.4, ease: easeIn },
    }),
  };

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden bg-white"
      style={{ height: "100dvh" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={banners[current].title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-10"
          >
            {/* LEFT CONTENT */}
            <div className="max-w-xl text-left">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {banners[current].title}
              </motion.h1>

              <motion.p
                className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base md:text-lg"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {banners[current].description}
              </motion.p>

              <motion.div
                className="mt-6 sm:mt-10 flex items-center justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="button"
                  icon={<Plus size={22} className="text-white" />}
                  label="ADD TO BAG"
                  className="bg-gradient-to-r from-orange-400 to-orange-500 px-5 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-white font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                />
              </motion.div>
            </div>

            {/* RIGHT IMAGE */}
            <motion.div
              className="relative w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, rotate: -10, y: 40 }}
              animate={{ opacity: 1, rotate: -5, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <motion.img
                src={banners[current].productImage}
                alt={banners[current].title}
                className="max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] w-full drop-shadow-2xl transition-transform duration-700 ease-in-out"
                whileHover={{ scale: 1.1, rotate: 0 }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 z-30">
        <Button
          onClick={prevSlide}
          icon={<ArrowLeft size={22} />}
          className="p-3 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-orange-500 shadow transition duration-300"
        />
        <Button
          onClick={nextSlide}
          icon={<ArrowRight size={22} />}
          className="p-3 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-orange-500 shadow transition duration-300"
        />
      </div>
    </section>
  );
};

export default Banner;
