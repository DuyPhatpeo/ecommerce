import { useEffect, useState, useRef, useCallback } from "react";
import { FiShoppingBag, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HotDeal = () => {
  // =============== Countdown ===============
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = targetDate.getTime() - new Date().getTime();

    if (diff <= 0) {
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
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      salePrice: 5000000,
      regularPrice: 6500000,
    },
    {
      id: 2,
      name: "Nike Air Zoom Pegasus 40",
      img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      salePrice: 5500000,
      regularPrice: 7000000,
    },
    {
      id: 3,
      name: "Puma RS-X Reinvent",
      img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      salePrice: 4800000,
      regularPrice: 6200000,
    },
  ];

  const formatVND = (num: number) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    startAutoSlide();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    startAutoSlide();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (idx: number) => {
    if (isAnimating || idx === currentIndex) return;
    setIsAnimating(true);
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    startAutoSlide();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="flex flex-col md:grid md:grid-cols-2 bg-white overflow-hidden h-[85vh]">
      {/* LEFT SIDE */}
      <div className="relative flex items-center justify-center text-white h-[40vh] md:h-full">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
          alt="Deal background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />

        <div className="relative z-10 text-center px-5 sm:px-10 md:px-12 lg:px-16 max-w-md sm:max-w-lg md:max-w-xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 animate-fade-in">
            Exclusive Hot Deal Ends Soon!
          </h2>

          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-90 leading-relaxed animate-fade-in-delay">
            Who are in extremely love with eco friendly system.
          </p>

          {/* Countdown */}
          <div className="flex justify-center bg-white/95 backdrop-blur-sm text-black rounded-2xl shadow-2xl px-4 sm:px-6 py-4 sm:py-5 mb-6 md:mb-8 flex-wrap gap-3 sm:gap-5 animate-slide-up">
            {[
              { label: "Days", value: formatValue(timeLeft.days) },
              { label: "Hours", value: formatValue(timeLeft.hours) },
              { label: "Mins", value: formatValue(timeLeft.minutes) },
              { label: "Secs", value: formatValue(timeLeft.seconds) },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`text-center relative w-14 sm:w-16 md:w-20 ${
                  index !== 3 ? "border-r border-gray-300 pr-3 sm:pr-5" : ""
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums text-orange-500">
                    {item.value}
                  </p>
                </div>
                <p className="text-xs sm:text-sm uppercase tracking-wider mt-1 text-gray-600 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* SHOP NOW */}
          <button className="cursor-pointer w-full sm:w-auto bg-gray-900 hover:bg-orange-500 text-white font-semibold text-sm sm:text-base py-3 sm:py-4 px-8 sm:px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 animate-fade-in-delay-2">
            SHOP NOW
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-12 relative overflow-hidden h-[40vh] md:h-full">
        {/* Decorative background */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-5" />

        {/* Product Display */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute w-full flex flex-col items-center transition-all duration-500 ease-out"
            style={{
              transform: `translateX(${direction * 0}px)`,
              opacity: 1,
            }}
          >
            <div className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] mb-5 md:mb-8 transition-transform duration-300 hover:scale-105">
              <img
                src={products[currentIndex].img}
                alt={products[currentIndex].name}
                className="w-full aspect-[3/4] object-cover rounded-2xl drop-shadow-2xl"
              />
            </div>

            <p className="text-gray-400 line-through text-sm sm:text-base mb-1">
              {formatVND(products[currentIndex].regularPrice)}
            </p>

            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-orange-500">
              {formatVND(products[currentIndex].salePrice)}
            </p>

            <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase mb-6 max-w-xs sm:max-w-md text-gray-800">
              {products[currentIndex].name}
            </h3>

            <button className="cursor-pointer flex items-center gap-2 text-white font-semibold text-sm sm:text-base bg-gray-900 hover:bg-orange-500 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95">
              <FiShoppingBag size={18} />
              Add to Bag
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-50"
        >
          <FiChevronLeft size={28} className="sm:w-8 sm:h-8" />
        </button>

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-50"
        >
          <FiChevronRight size={28} className="sm:w-8 sm:h-8" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-6 sm:bottom-8 flex gap-2 sm:gap-3">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              disabled={isAnimating}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                idx === currentIndex
                  ? "bg-orange-500 w-8 sm:w-10"
                  : "bg-gray-300 hover:bg-gray-400 w-2 sm:w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDeal;
