import React from "react";
import { motion } from "framer-motion";

// Hàm tạo variants cho fadeInUp với delay tuỳ chỉnh
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
  } as const);

const Promo: React.FC = () => {
  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* Motion container chính */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-stretch gap-4 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* LEFT GROUP: 4 ảnh nhỏ */}
          <motion.div className="flex flex-col gap-4 w-full lg:w-auto md:items-center">
            {/* Top row */}
            <motion.div className="flex flex-col sm:flex-row justify-center sm:justify-start md:justify-center gap-3 sm:gap-4">
              {[
                { src: "/c1.jpg", alt: "Giày 1", delay: 0.25 },
                { src: "/c2.jpg", alt: "Giày 2", delay: 0.35 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-52 bg-gray-50"
                  variants={fadeInUp(item.delay)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom row */}
            <motion.div className="flex flex-col sm:flex-row justify-center sm:justify-start md:justify-center gap-3 sm:gap-4">
              {[
                { src: "/c3.jpg", alt: "Giày 3", delay: 0.45 },
                { src: "/c4.jpg", alt: "Giày 4", delay: 0.55 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-52 bg-gray-50"
                  variants={fadeInUp(item.delay)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT BANNER: 1 ảnh lớn */}
          <motion.div
            className="flex justify-center items-center overflow-hidden w-full lg:w-auto bg-gray-50 h-[436px] sm:h-[440px] md:h-[436px]"
            variants={fadeInUp(0.6)}
          >
            <img
              src="/c5.jpg"
              alt="Banner"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Promo;
