import { motion } from "framer-motion";
import { FiTruck, FiRefreshCw, FiHeadphones, FiShield } from "react-icons/fi";

const features = [
  {
    icon: <FiTruck className="w-8 h-8" />,
    title: "Free Delivery",
    description: "Free Shipping on all orders",
  },
  {
    icon: <FiRefreshCw className="w-8 h-8" />,
    title: "Return Policy",
    description: "30-day money back guarantee",
  },
  {
    icon: <FiHeadphones className="w-8 h-8" />,
    title: "24/7 Support",
    description: "We're here to help anytime",
  },
  {
    icon: <FiShield className="w-8 h-8" />,
    title: "Secure Payment",
    description: "100% protected & safe checkout",
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
