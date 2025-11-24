import React from "react";
import {
  Facebook,
  Twitter,
  Dribbble,
  Instagram,
  Send,
  Heart,
} from "lucide-react";
import Button from "../ui/Button";

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
    <footer
      className="relative text-gray-300 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/90"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-5 relative inline-block">
              About
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 hover:text-gray-300 transition-colors">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore dolore magna aliqua.
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-5 relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Stay updated with our latest news and offers
            </p>
            <form className="group w-full max-w-md">
              <div className="flex overflow-hidden rounded-lg border border-gray-700 group-hover:border-[#ff9f00] transition-all duration-300 shadow-lg">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-[#2a2a2a]/60 text-white text-sm outline-none placeholder-gray-500 focus:bg-[#333333]/70 transition-colors"
                />
                <Button
                  type="submit"
                  icon={<Send size={16} />}
                  className="bg-gradient-to-r from-[#ff9f00] to-[#ffb347] 
                           hover:from-[#e48f00] hover:to-[#ff9f00]
                           text-white px-4 sm:px-6 py-3 flex-shrink-0
                           transition-all duration-300
                           hover:shadow-lg hover:shadow-[#ff9f00]/50"
                />
              </div>
            </form>
          </div>

          {/* Instagram Feed */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-5 relative inline-block">
              Instagram
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <div className="grid grid-cols-4 gap-2 max-w-[240px] sm:max-w-[260px]">
              {instaImages.map((src, index) => (
                <div
                  key={index}
                  className="relative w-[55px] h-[55px] sm:w-[65px] sm:h-[65px] overflow-hidden 
                             group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                >
                  <img src={src} alt={`insta-${index}`} loading="eager" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff9f00]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Instagram
                      size={20}
                      className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-5 relative inline-block">
              Follow
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>

            <div className="mb-4 max-w-[280px]">
              <a
                href="https://www.facebook.com/nike"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#2a2a2a]/60 rounded-lg border border-gray-700 hover:border-[#ff9f00] transition-all duration-300 hover:shadow-lg hover:shadow-[#ff9f00]/20 overflow-hidden"
              >
                {/* Profile Section */}
                <div className="relative px-4 py-4">
                  {/* Avatar */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png"
                        alt="Nike Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base group-hover:text-[#ff9f00] transition-colors truncate">
                        Nike
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Sports & Recreation
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        37M followers
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button className="w-full py-2.5 bg-gradient-to-r from-[#1877f2] to-[#0c63d4] hover:from-[#166fe5] hover:to-[#0b58c0] text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
                    <Facebook size={16} />
                    Follow on Facebook
                  </button>
                </div>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              {[Facebook, Twitter, Dribbble, Instagram].map((Icon, i) => (
                <Button
                  key={i}
                  icon={<Icon size={18} />}
                  className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-700 text-gray-300 
                             hover:border-transparent hover:text-white
                             rounded-full bg-transparent transition-all duration-300
                             hover:scale-110 hover:shadow-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 sm:mt-14 pt-6 sm:pt-8 pb-18 sm:pb-8 border-t border-gray-800">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-400 flex flex-row items-center justify-center gap-1 flex-wrap px-2">
              <span>©2025 Made with</span>
              <Heart
                size={14}
                strokeWidth={2}
                fill="#ff9f00"
                className="text-[#ff9f00] mx-1 animate-pulse"
              />
              <span>by</span>
              <a
                href="#"
                className="text-[#ff9f00] hover:text-[#ffb347] font-semibold transition-colors ml-1 hover:underline decoration-2 underline-offset-2"
              >
                Dino
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
