import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const animation = { duration: 35000, easing: (t: number) => t }; // chậm, tuyến tính

export default function BrandStrip() {
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

  const duplicatedBrands = [...brands, ...brands];

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    drag: false,
    slides: { perView: 5, spacing: 10 }, // default
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 4, spacing: 10 }, // tablet
      },
      "(max-width: 768px)": {
        slides: { perView: 3, spacing: 8 }, // mobile
      },
      "(max-width: 480px)": {
        slides: { perView: 2, spacing: 6 }, // nhỏ hơn
      },
    },
    created(s) {
      s.moveToIdx(brands.length, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + brands.length, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + brands.length, true, animation);
    },
  });

  return (
    <section className="bg-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-8">
          Trusted by Leading Brands
        </h2>

        <div ref={sliderRef} className="keen-slider overflow-hidden">
          {duplicatedBrands.map((src, i) => (
            <div key={i} className="keen-slider__slide flex justify-center">
              <img
                src={src}
                alt={`brand-${i}`}
                className="h-12 sm:h-14 md:h-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 ease-in-out cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
