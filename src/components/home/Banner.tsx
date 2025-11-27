import { useEffect, useState, useCallback, useMemo } from "react";
import { FiPlus, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const Banner = () => {
  const banners = useMemo(
    () => [
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
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % banners.length);
      setTimeout(() => setIsAnimating(false), 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % banners.length);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [isAnimating, banners.length]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [isAnimating, banners.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (!isAnimating && index !== current) {
        setIsAnimating(true);
        setCurrent(index);
        setTimeout(() => setIsAnimating(false), 400);
      }
    },
    [isAnimating, current]
  );

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden bg-white"
      style={{ height: "100dvh" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url(/banner-bg.jpg)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div
          key={current}
          className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-10 animate-fadeIn"
        >
          {/* LEFT CONTENT */}
          <div className="max-w-xl text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              {banners[current].title}
            </h1>

            <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base md:text-lg">
              {banners[current].description}
            </p>

            <div className="mt-6 sm:mt-10 flex items-center justify-start">
              <button
                type="button"
                className="bg-gradient-to-r from-orange-400 to-orange-500 px-5 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-white font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
              >
                <FiPlus size={22} className="text-white" />
                ADD TO BAG
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center">
            <img
              src={banners[current].productImage}
              alt={banners[current].title}
              className="max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] w-full object-contain hover:scale-105 transition-transform duration-300"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-orange-500 shadow-md"
                  : "w-2 bg-gray-800/40 hover:bg-gray-800/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2 z-30">
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-white/20 text-gray-700 hover:text-orange-500 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50"
          aria-label="Previous slide"
        >
          <FiArrowLeft size={18} strokeWidth={2} />
        </button>
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-white/20 text-gray-700 hover:text-orange-500 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50"
          aria-label="Next slide"
        >
          <FiArrowRight size={18} strokeWidth={2} />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
};

export default Banner;
