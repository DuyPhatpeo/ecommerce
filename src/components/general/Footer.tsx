import { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Send,
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Button from "../ui/Button";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Thanks for subscribing with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer
      className="relative text-gray-300 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/80"></div>

      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-16 py-30">
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
            gap-8 lg:divide-x lg:divide-gray-700/50
          "
        >
          {/* About */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-3">
              About
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300" />
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed hover:text-gray-200 transition">
              We are passionate about delivering the best products and services
              to our customers. Join our community and stay connected with the
              latest trends and updates.
            </p>

            <div className="flex gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-300 flex items-center justify-center">
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Quality First
                </p>
                <p className="text-gray-500 text-xs">Since 2020</p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 pt-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition cursor-pointer">
                <Phone size={14} />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition cursor-pointer">
                <Mail size={14} />
                <span>info@company.com</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm hover:text-orange-400 transition cursor-pointer">
                <MapPin size={14} className="mt-0.5" />
                <span>123 Business St, City, Country</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 lg:pl-8">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-3">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300" />
            </h3>

            <p className="text-gray-400 text-sm">
              Stay updated with our latest news and exclusive offers delivered
              to your inbox.
            </p>

            {/* Modern Input */}
            <div
              className="
                flex max-w-md overflow-hidden rounded-2xl 
                border border-gray-700 bg-gray-800/40 backdrop-blur-sm 
                shadow-lg group hover:border-orange-400 
                transition-all duration-300
              "
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                className="
                  flex-1 px-4 py-3 text-white bg-transparent 
                  text-sm placeholder-gray-500 outline-none
                "
              />
              <Button
                onClick={handleSubscribe}
                icon={<Send size={16} />}
                className="
                  px-5 py-3 rounded-xl
                  bg-gradient-to-r from-orange-400 to-orange-300 
                  hover:from-orange-500 hover:to-orange-400 
                  text-white transition-all duration-300
                "
              />
            </div>

            {/* Quick Links */}
            <div className="pt-3">
              <h4 className="text-white font-semibold text-sm mb-3">
                Quick Links
              </h4>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
                {["About Us", "FAQ", "Our Services", "Blog"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="
                        text-gray-400 text-sm hover:text-orange-400 
                        transition-all hover:pl-2 block duration-300
                      "
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-3 lg:pl-8">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-3">
              Follow Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300" />
            </h3>

            {/* FB Plugin */}
            <div className="w-[280px] bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-orange-400 transition">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnike&tabs=timeline&width=280&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                width="280"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            {/* Social Icons */}
            <div className="pt-1">
              <p className="text-gray-400 text-sm mb-3">Connect with us:</p>

              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<Facebook size={18} />}
                  className="
                    w-11 h-11 rounded-2xl text-white
                    bg-blue-600
                    transition-all hover:scale-110
                    hover:bg-blue-700 shadow-md hover:shadow-blue-500/40
                  "
                />

                <Button
                  icon={<Twitter size={18} />}
                  className="
                    w-11 h-11 rounded-2xl text-white
                    bg-sky-500
                    transition-all hover:scale-110 shadow-md
                    hover:bg-sky-600 hover:shadow-sky-400/40
                  "
                />

                <Button
                  icon={<Instagram size={18} />}
                  className="
                    w-11 h-11 rounded-2xl text-white
                    bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf]
                    transition-all hover:scale-110 shadow-md hover:shadow-pink-500/40
                    hover:from-[#feda75] hover:via-[#e72c80] hover:to-[#b43cdf]
                  "
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-3">We Accept:</p>

              <div className="flex flex-wrap gap-3">
                {[
                  {
                    src: "https://logos-world.net/wp-content/uploads/2020/05/Visa-Logo-700x394.png",
                    alt: "VISA",
                    bg: "bg-blue-50",
                    gradient: "from-blue-100 to-blue-50",
                    border: "border-blue-200",
                  },
                  {
                    src: "https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo-700x394.png",
                    alt: "Mastercard",
                    bg: "bg-red-50",
                    gradient: "from-red-100 to-yellow-50",
                    border: "border-red-200",
                  },
                  {
                    src: "https://logos-world.net/wp-content/uploads/2020/08/PayPal-Symbol-500x281.png",
                    alt: "PayPal",
                    bg: "bg-blue-50",
                    gradient: "from-blue-50 to-blue-100",
                    border: "border-blue-200",
                  },
                ].map((card) => (
                  <div
                    key={card.alt}
                    className={`
                      group relative ${card.bg} bg-gradient-to-br ${card.gradient} ${card.border}
                      w-15 h-10 rounded-xl flex items-center justify-center
                      shadow-md hover:shadow-xl transition hover:-translate-y-1
                      cursor-pointer overflow-hidden p-2
                    `}
                  >
                    <img
                      src={card.src}
                      alt={card.alt}
                      className="
                        w-full h-full object-contain z-10 
                        group-hover:scale-110 transition-transform
                      "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
              © 2025 Made with
              <Heart
                size={14}
                fill="rgb(251 146 60)"
                className="text-orange-400 animate-pulse"
              />
              by
              <a
                href="https://github.com/DuyPhatpeo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 font-semibold hover:text-orange-300 underline underline-offset-2 ml-1"
              >
                DuyPhat
              </a>
            </div>

            <div className="flex gap-6 text-xs sm:text-sm">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-400 hover:text-orange-400 transition"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
