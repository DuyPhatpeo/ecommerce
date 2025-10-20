import React from "react";
import { motion } from "framer-motion";

const BrandStrip: React.FC = () => {
  const brands = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  // Lặp lại mảng để trượt liên tục
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="bg-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-700 mb-8">
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
              duration: 20,
              ease: "linear",
            }}
          >
            {duplicatedBrands.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`brand-${i}`}
                className="
                  h-10 sm:h-12 md:h-14 lg:h-16 
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
