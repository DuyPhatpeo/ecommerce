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
      <div className="relative z-10 py-24 max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-5 relative inline-block">
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
            <h3 className="text-white font-bold text-xl mb-5 relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Stay updated with our latest news and offers
            </p>
            <form className="group">
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
            <h3 className="text-white font-bold text-xl mb-5 relative inline-block">
              Instagram
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {instaImages.map((src, index) => (
                <div
                  key={index}
                  className="relative w-full overflow-hidden group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={src}
                    alt={`insta-${index}`}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff9f00]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Instagram
                      size={24}
                      className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-5 relative inline-block">
              Follow
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>

            <div className="overflow-hidden mb-2">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsweetsoftvn&tabs=&width=250&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false"
                width="250"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              {[Facebook, Twitter, Dribbble, Instagram].map((Icon, i) => (
                <Button
                  key={i}
                  icon={<Icon size={18} />}
                  className="w-11 h-11 border border-gray-700 text-gray-300 
                             hover:border-transparent hover:text-white
                             rounded-full bg-transparent transition-all duration-300
                             hover:scale-110 hover:shadow-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-14 pt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-400 flex flex-row items-center justify-center gap-1 flex-wrap">
              <span>Copyright ©2025 All rights reserved | Made with</span>
              <Heart
                size={16}
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
