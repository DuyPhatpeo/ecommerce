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
    [],
  );

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating, banners.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating, banners.length]);

  /* Auto play */
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const goToSlide = (index: number) => {
    if (index === current || isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <section className="relative h-screen overflow-hidden text-white">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url(/banner-bg.jpg)" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div
          key={current}
          className="h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 animate-slideIn"
        >
          {/* IMAGE – LEFT */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            <img
              src={banners[current].productImage}
              alt={banners[current].title}
              className="max-w-[420px] lg:max-w-[520px] w-full object-contain -rotate-12 transition-transform duration-700 hover:scale-105 drop-shadow-2xl"
              loading="eager"
            />
            <div className="absolute -bottom-16 lg:-bottom-24 w-full h-16 lg:h-24 bg-black/40 blur-3xl rounded-full" />
          </div>

          {/* TEXT – RIGHT */}
          <div className="w-full lg:w-1/2 text-center lg:text-right flex flex-col items-center lg:items-end">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl">
              {banners[current].title}
            </h1>

            <p className="mt-4 lg:mt-6 text-white/90 text-sm sm:text-base lg:text-lg max-w-xl px-4 lg:px-0">
              {banners[current].description}
            </p>

            <div className="mt-8 lg:mt-10">
              <button className="cursor-pointer bg-gradient-to-r from-orange-400 to-red-500 px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-2xl font-semibold hover:scale-105 hover:shadow-orange-500/50 active:scale-95 transition-all flex items-center gap-2 text-sm lg:text-base">
                <FiPlus size={20} />
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INDICATORS */}
      <div className="absolute bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer h-1 rounded-full transition-all duration-300 ${
              current === index
                ? "w-12 bg-orange-400"
                : "w-6 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* NAV BUTTONS */}
      <div className="absolute bottom-28 lg:bottom-8 right-4 lg:right-8 flex gap-2 lg:gap-3 z-20">
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="cursor-pointer w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/40 flex items-center justify-center hover:border-white hover:bg-white/10 disabled:opacity-50 backdrop-blur-sm transition-all active:scale-90"
          aria-label="Previous slide"
        >
          <FiArrowLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="cursor-pointer w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/40 flex items-center justify-center hover:border-white hover:bg-white/10 disabled:opacity-50 backdrop-blur-sm transition-all active:scale-90"
          aria-label="Next slide"
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Banner;
