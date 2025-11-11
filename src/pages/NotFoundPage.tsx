import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 text-center px-6">
      <motion.h1
        className="text-[10rem] font-extrabold text-orange-500 drop-shadow-lg mb-4"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.h2
        className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Page Not Found
      </motion.h2>

      <motion.p
        className="text-lg text-gray-600 mb-10 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        It seems like the page you’re looking for doesn’t exist or has been
        moved.
      </motion.p>

      <motion.button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 text-lg font-medium rounded-2xl shadow-md hover:bg-orange-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-6 h-6" />
        Go back Home
      </motion.button>
    </div>
  );
}
