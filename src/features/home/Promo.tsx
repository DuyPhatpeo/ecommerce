import React from "react";
import { motion } from "framer-motion";

const fadeInUp = (delay = 0) =>
  ({
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }) as const;

const promoItems = [
  { src: "/c1.jpg", alt: "Running sneakers", label: "Running", delay: 0.25 },
  { src: "/c2.jpg", alt: "Outdoor shoes", label: "Outdoor", delay: 0.35 },
  { src: "/c3.jpg", alt: "Training shoes", label: "Training", delay: 0.45 },
  { src: "/c4.jpg", alt: "Skateboard shoes", label: "Skateboard", delay: 0.55 },
];

const Promo: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-stretch gap-4 lg:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* LEFT: 4 small images in 2x2 grid */}
          <motion.div className="flex flex-col gap-4 w-full lg:w-auto">
            {/* Top row */}
            <motion.div className="flex flex-col sm:flex-row gap-4">
              {promoItems.slice(0, 2).map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group overflow-hidden rounded-xl w-full sm:w-auto h-52 bg-gray-100 cursor-pointer"
                  variants={fadeInUp(item.delay)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {/* Label */}
                  <span className="absolute bottom-4 left-4 text-white text-sm font-semibold tracking-wide uppercase">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom row */}
            <motion.div className="flex flex-col sm:flex-row gap-4">
              {promoItems.slice(2).map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group overflow-hidden rounded-xl w-full sm:w-auto h-52 bg-gray-100 cursor-pointer"
                  variants={fadeInUp(item.delay)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white text-sm font-semibold tracking-wide uppercase">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: 1 large banner */}
          <motion.div
            className="relative group overflow-hidden rounded-xl w-full lg:w-auto bg-gray-100 h-[280px] sm:h-[440px] cursor-pointer"
            variants={fadeInUp(0.6)}
          >
            <img
              src="/c5.jpg"
              alt="Featured collection"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="text-white/70 text-xs font-medium uppercase tracking-widest">
                Featured
              </span>
              <h3 className="text-white text-xl font-bold mt-1">
                New Arrivals
              </h3>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Promo;
