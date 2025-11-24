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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/90"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              About
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed hover:text-gray-200 transition-colors">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore dolore magna aliqua.
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-gray-400 text-sm">
              Stay updated with our latest news and offers
            </p>
            <form className="flex max-w-md overflow-hidden rounded-lg border border-gray-700 shadow-lg group hover:border-[#ff9f00] transition-all duration-300">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#2a2a2a]/60 text-white text-sm placeholder-gray-500 focus:bg-[#333]/70 outline-none transition-colors"
              />
              <Button
                type="submit"
                icon={<Send size={16} />}
                className="px-5 py-3 bg-gradient-to-r from-[#ff9f00] to-[#ffb347] hover:from-[#e48f00] hover:to-[#ff9f00] text-white transition-all duration-300 hover:shadow-lg"
              />
            </form>
          </div>

          {/* Instagram Feed */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Instagram
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <div className="grid grid-cols-4 gap-2 max-w-[260px]">
              {instaImages.map((src, index) => (
                <div
                  key={index}
                  className="relative w-[60px] h-[60px] overflow-hidden rounded-lg group cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={src}
                    alt={`insta-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#feda75]/80 via-[#fa7e1e]/60 to-[#d62976]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <Instagram
                      size={20}
                      className="text-white scale-0 group-hover:scale-100 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Follow
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>

            <div className="mb-4 max-w-[280px]">
              <a
                href="https://www.facebook.com/nike"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#2a2a2a]/60 rounded-lg border border-gray-700 hover:border-[#ff9f00] transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                <div className="flex items-center px-4 py-4 gap-3">
                  <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png"
                      alt="Nike Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate group-hover:text-[#ff9f00] transition-colors">
                      Nike
                    </h4>
                    <p className="text-gray-400 text-xs">Sports & Recreation</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      37M followers
                    </p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-gradient-to-r from-[#1877f2] to-[#0c63d4] hover:from-[#166fe5] hover:to-[#0b58c0] text-white text-sm font-semibold rounded-b-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
                  <Facebook size={16} /> Follow
                </button>
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<Facebook size={18} />}
                className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-700 text-gray-300 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:text-[#1877f2] hover:border-[#1877f2] bg-gray-800 hover:bg-[#1877f2]/20"
              />
              <Button
                icon={<Twitter size={18} />}
                className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-700 text-gray-300 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:text-[#1da1f2] hover:border-[#1da1f2] bg-gray-800 hover:bg-[#1da1f2]/20"
              />
              <Button
                icon={<Dribbble size={18} />}
                className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-700 text-gray-300 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:text-[#ea4c89] hover:border-[#ea4c89] bg-gray-800 hover:bg-[#ea4c89]/20"
              />
              <Button
                icon={<Instagram size={18} />}
                className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-700 text-gray-300 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative group"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="text-xs sm:text-sm text-gray-400 flex justify-center items-center gap-1 flex-wrap">
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
              className="text-[#ff9f00] hover:text-[#ffb347] font-semibold transition-colors hover:underline decoration-2 underline-offset-2 ml-1"
            >
              Dino
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
