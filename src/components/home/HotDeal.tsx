import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";

const HotDeal: React.FC = () => {
  const navigate = useNavigate();

  // =============== Countdown ===============
  const [targetDate] = useState(() => {
    const saved = localStorage.getItem("hotdeal_expire");
    if (saved) return new Date(saved);

    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 ngày tới
    localStorage.setItem("hotdeal_expire", date.toISOString());
    return date;
  });

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = targetDate.getTime() - new Date().getTime();

    if (diff <= 0) {
      // Khi countdown hết → tạo vòng mới
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 30);
      localStorage.setItem("hotdeal_expire", newDate.toISOString());
      targetDate.setTime(newDate.getTime());
      setCurrentIndex(0); // reset slide về đầu
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formatValue = (num: number) => num.toString().padStart(2, "0");

  // =============== Products ===============
  const products = [
    {
      id: 1,
      name: "Adidas New Hammer Sole",
      img: "e-p1.png",
      salePrice: 5000000,
      regularPrice: 6500000,
    },
    {
      id: 2,
      name: "Nike Air Zoom Pegasus 40",
      img: "e-p2.png",
      salePrice: 5500000,
      regularPrice: 7000000,
    },
    {
      id: 3,
      name: "Puma RS-X Reinvent",
      img: "e-p3.png",
      salePrice: 4800000,
      regularPrice: 6200000,
    },
  ];

  const formatVND = (num: number) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide every 5s
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
  }, [products.length]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    startAutoSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    startAutoSlide();
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="flex flex-col md:grid md:grid-cols-2 bg-white overflow-hidden min-h-[90vh]">
      {/* LEFT SIDE */}
      <div className="relative flex items-center justify-center text-white h-[55vh] sm:h-[60vh] md:h-auto">
        <img
          src="exclusive.jpg"
          alt="Deal background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-5 sm:px-10 md:px-12 lg:px-0 max-w-md sm:max-w-lg md:max-w-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Exclusive Hot Deal Ends Soon!
          </h2>
          <p className="text-xs sm:text-sm md:text-base mb-6 opacity-90 leading-relaxed">
            Who are in extremely love with eco friendly system.
          </p>

          {/* Countdown */}
          <div className="flex justify-center bg-white text-black rounded-xl shadow-md px-3 sm:px-5 py-3 sm:py-4 mb-6 md:mb-8 flex-wrap gap-2 sm:gap-4">
            {[
              { label: "Days", value: formatValue(timeLeft.days) },
              { label: "Hours", value: formatValue(timeLeft.hours) },
              { label: "Mins", value: formatValue(timeLeft.minutes) },
              { label: "Secs", value: formatValue(timeLeft.seconds) },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`text-center relative overflow-hidden w-12 sm:w-14 md:w-16 ${
                  index !== 3 ? "border-r border-gray-300 pr-2 sm:pr-4" : ""
                }`}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={item.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums">
                      {item.value}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* SHOP NOW */}
          <Button
            type="button"
            label="SHOP NOW"
            onClick={() => navigate("/shop")}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition shadow-md"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-gray-100 flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-12 relative overflow-hidden min-h-[60vh] md:min-h-[90vh]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={products[currentIndex].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute w-full flex flex-col items-center"
          >
            <div className="h-[220px] sm:h-[300px] md:h-[380px] lg:h-[480px] flex items-center justify-center w-[90%] sm:w-[80%] mb-5 md:mb-8">
              <img
                src={products[currentIndex].img}
                alt={products[currentIndex].name}
                className="max-h-full object-contain transition-transform duration-300 hover:scale-105 drop-shadow-2xl"
              />
            </div>

            <p className="text-gray-400 line-through text-xs sm:text-sm">
              {formatVND(products[currentIndex].regularPrice)}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 text-orange-600">
              {formatVND(products[currentIndex].salePrice)}
            </p>
            <h3 className="text-xs sm:text-sm md:text-base font-bold uppercase mb-5 max-w-xs sm:max-w-md">
              {products[currentIndex].name}
            </h3>

            <Button
              type="button"
              icon={<ShoppingBag size={18} />}
              label="Add to Bag"
              className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm md:text-base bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full transition"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          type="button"
          icon={<ChevronLeft size={22} />}
          onClick={handlePrev}
          className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        />
        <Button
          type="button"
          icon={<ChevronRight size={22} />}
          onClick={handleNext}
          className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        />
      </div>
    </section>
  );
};

export default HotDeal;
