import { useState } from "react";
import {
  Facebook,
  Twitter,
  Dribbble,
  Instagram,
  Send,
  Heart,
} from "lucide-react";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const instaImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop",
  ];

  const handleSubscribe = () => {
    if (email) {
      alert(`Thanks for subscribing with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer
      className="relative text-gray-300 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&h=800&fit=crop&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/90"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-30 sm:py-30 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              About
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed hover:text-gray-200 transition-colors">
              We are passionate about delivering the best products and services
              to our customers. Join our community and stay connected with the
              latest trends and updates.
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-gray-400 text-sm">
              Stay updated with our latest news and exclusive offers delivered
              to your inbox.
            </p>

            <div className="flex max-w-md overflow-hidden rounded-lg border border-gray-700 shadow-lg group hover:border-[#ff9f00] transition-all duration-300">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#2a2a2a]/60 text-white text-sm placeholder-gray-500 focus:bg-[#333]/70 outline-none transition-colors"
              />
              <Button
                onClick={handleSubscribe}
                icon={<Send size={16} />}
                className="px-5 py-3 bg-gradient-to-r from-[#ff9f00] to-[#ffb347] hover:from-[#e48f00] hover:to-[#ff9f00] text-white transition-all duration-300 hover:shadow-lg"
              />
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Instagram
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Follow us @ourcompany for daily inspiration
            </p>

            <div className="grid grid-cols-4 gap-2 max-w-[260px]">
              {instaImages.map((src, index) => (
                <div
                  key={index}
                  className="relative w-[60px] h-[60px] overflow-hidden rounded-lg group cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <img src={src} className="w-full h-full object-cover" />
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

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Follow Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff9f00] to-[#ffb347]" />
            </h3>

            <div className="w-full bg-transparent rounded-lg overflow-hidden">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnike&tabs=timeline&width=200&height=90&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                width="200"
                height="90"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            {/* Social Icons */}
            <p className="text-gray-400 text-sm mb-2">Connect with us:</p>
            <div className="flex flex-wrap gap-3">
              <Button
                icon={<Facebook size={18} />}
                className="w-10 h-10 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full transition-all hover:scale-110 hover:shadow-lg"
              />
              <Button
                icon={<Twitter size={18} />}
                className="w-10 h-10 bg-[#1da1f2] hover:bg-[#1a91da] text-white rounded-full transition-all hover:scale-110 hover:shadow-lg"
              />
              <Button
                icon={<Instagram size={18} />}
                className="w-10 h-10 bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]
             rounded-full text-white transition-all hover:scale-110 hover:shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 flex-wrap">
              © 2025 Made with
              <Heart
                size={14}
                fill="#ff9f00"
                className="animate-pulse text-[#ff9f00]"
              />
              by
              <a className="text-[#ff9f00] font-semibold hover:text-[#ffb347] underline underline-offset-2 ml-1">
                Dino
              </a>
            </div>

            <div className="flex gap-6 text-xs sm:text-sm">
              <a className="text-gray-400 hover:text-[#ff9f00] transition-colors">
                Privacy Policy
              </a>
              <a className="text-gray-400 hover:text-[#ff9f00] transition-colors">
                Terms of Service
              </a>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-[#ff9f00] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
