import { motion } from "framer-motion";
import { Truck, RefreshCw, Headphones, Shield } from "lucide-react";
import React from "react";

const features = [
  {
    icon: <Truck className="w-10 h-10 text-gray-700" />,
    title: "Free Delivery",
    description: "Free Shipping on all orders",
  },
  {
    icon: <RefreshCw className="w-10 h-10 text-gray-700" />,
    title: "Return Policy",
    description: "30-day money back guarantee",
  },
  {
    icon: <Headphones className="w-10 h-10 text-gray-700" />,
    title: "24/7 Support",
    description: "We're here to help anytime",
  },
  {
    icon: <Shield className="w-10 h-10 text-gray-700" />,
    title: "Secure Payment",
    description: "100% protected & safe checkout",
  },
];

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.15,
      },
    },
  };

  return (
    <section className="bg-white py-12 md:py-20 border-t border-gray-200/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.04, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.04, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 rounded-2xl overflow-hidden shadow-xl"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -6,
                transition: {
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="flex flex-col items-center justify-center text-center py-10 px-6 bg-gradient-to-b from-gray-50 to-white hover:from-orange-50 hover:to-white transition-all duration-500 cursor-pointer group relative"
            >
              {/* Hover effect background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-transparent"
              />

              {/* Icon with animation */}
              <motion.div
                variants={iconVariants}
                className="mb-4 relative z-10"
              >
                <div className="relative">
                  {/* Icon glow effect */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      hoveredIndex === index
                        ? {
                            opacity: 0.25,
                            scale: 1.4,
                          }
                        : {
                            opacity: 0,
                            scale: 0.8,
                          }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 bg-orange-400 rounded-full blur-xl"
                  />

                  {/* Icon */}
                  <motion.div
                    className="relative text-gray-700 group-hover:text-orange-600 transition-colors duration-400"
                    animate={
                      hoveredIndex === index
                        ? {
                            rotate: [0, -8, 8, -8, 8, 0],
                          }
                        : {
                            rotate: 0,
                          }
                    }
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    {item.icon}
                  </motion.div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.25 + index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-base md:text-lg font-semibold text-gray-800 mb-2 relative z-10 group-hover:text-orange-700 transition-colors duration-400"
              >
                {item.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.35 + index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-sm text-gray-500 relative z-10 group-hover:text-gray-600 transition-colors duration-400"
              >
                {item.description}
              </motion.p>

              {/* Bottom accent line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileHover={{
                  width: "60%",
                  opacity: 1,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full"
              />

              {/* Corner accent */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{
                  scale: 1,
                  opacity: 0.15,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-transparent rounded-bl-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
