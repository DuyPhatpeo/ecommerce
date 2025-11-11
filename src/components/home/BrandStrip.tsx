import React from "react";
import { motion } from "framer-motion";

const BrandStrip: React.FC = () => {
  // Logo các hãng giày nổi tiếng
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

  // Lặp lại mảng lần nữa để trượt liên tục
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="bg-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-8">
          Trusted by Leading Brands
        </h2>

        <div className="relative overflow-hidden">
          {/* Hiệu ứng gradient ở 2 đầu */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Slide chuyển động ngang */}
          <motion.div
            className="flex items-center gap-10 md:gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
          >
            {duplicatedBrands.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`brand-${i}`}
                className="
    h-8 sm:h-10 md:h-12 lg:h-14 
    opacity-60 hover:opacity-100
    grayscale hover:grayscale-0
    transition-all duration-300 ease-in-out
    cursor-pointer flex-shrink-0
  "
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;
