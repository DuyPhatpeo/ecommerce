import React from "react";
import {
  Facebook,
  Twitter,
  Dribbble,
  Instagram,
  Send,
  Heart,
} from "lucide-react";
import Button from "../ui/Button"; // ✅ import Button

const Footer: React.FC = () => {
  const instaImages = [
    "/i1.jpg",
    "/i2.jpg",
    "/i3.jpg",
    "/i4.jpg",
    "/i5.jpg",
    "/i6.jpg",
    "/i7.jpg",
    "/i8.jpg",
  ];

  return (
    <footer className="bg-[#1d1d1d] text-gray-300 py-30 px-8 sm:px-12 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* About Us */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            About
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore dolore magna aliqua.
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            Newsletter
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Stay updated with our latest
          </p>
          <form className="flex overflow-hidden rounded-lg border border-gray-600 focus-within:border-[#ff9f00] transition-all">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white text-gray-800 text-sm outline-none placeholder-gray-500"
            />
            <Button
              type="submit"
              icon={<Send size={18} />}
              className="bg-[#ff9f00] hover:bg-[#e48f00] text-white px-5 rounded-none"
            />
          </form>
        </div>

        {/* Instagram Feed */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            Instagram
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {instaImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`insta-${index}`}
                className="w-full h-16 object-cover rounded-md hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            Follow
          </h3>
          <p className="text-sm text-gray-400 mb-4">Let’s be social</p>
          <div className="flex space-x-3">
            {[Facebook, Twitter, Dribbble, Instagram].map((Icon, i) => (
              <Button
                key={i}
                icon={<Icon size={18} />}
                className="w-10 h-10 border border-gray-600 text-gray-300 
                           hover:border-[#ff9f00] hover:text-[#ff9f00] 
                           rounded-full bg-transparent transition-all"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-14 text-center text-sm text-gray-500 border-t border-gray-700 pt-6 flex items-center justify-center gap-1">
        <span>Copyright ©2025 All rights reserved | Made with</span>
        <Heart
          size={16}
          strokeWidth={2}
          className="text-[#ff9f00] mx-1 hover:scale-110 transition-transform"
        />
        <span>by</span>
        <a href="#" className="text-[#ff9f00] hover:underline ml-1">
          Colorlib
        </a>
      </div>
    </footer>
  );
};

export default Footer;
