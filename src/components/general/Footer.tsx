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
      style={{
        backgroundImage: "url('/footer-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/90"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-30 sm:py-30 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              About
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed hover:text-gray-200 transition-colors">
              We are passionate about delivering the best products and services
              to our customers. Join our community and stay connected with the
              latest trends and updates.
            </p>

            <div className="flex gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-300 flex items-center justify-center flex-shrink-0">
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  Quality First
                </p>
                <p className="text-gray-500 text-xs">Since 2020</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition-colors cursor-pointer">
                <Phone size={14} />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition-colors cursor-pointer">
                <Mail size={14} />
                <span>info@company.com</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm hover:text-orange-400 transition-colors cursor-pointer">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>123 Business St, City, Country</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300" />
            </h3>
            <p className="text-gray-400 text-sm">
              Stay updated with our latest news and exclusive offers delivered
              to your inbox.
            </p>

            <div className="flex max-w-md overflow-hidden rounded-lg border border-gray-700 shadow-lg group hover:border-orange-400 transition-all duration-300">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 bg-opacity-60 text-white text-sm placeholder-gray-500 outline-none transition-colors"
              />
              <Button
                onClick={handleSubscribe}
                icon={<Send size={16} />}
                className="px-5 py-3 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400 text-white transition-all duration-300 hover:shadow-lg"
              />
            </div>

            {/* Quick Links */}
            <div className="pt-4">
              <h4 className="text-white font-semibold text-sm mb-3">
                Quick Links
              </h4>

              <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-orange-400 transition-all hover:pl-2 inline-block duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-orange-400 transition-all hover:pl-2 inline-block duration-300"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-orange-400 transition-all hover:pl-2 inline-block duration-300"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-orange-400 transition-all hover:pl-2 inline-block duration-300"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg sm:text-xl relative inline-block mb-4">
              Follow Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300" />
            </h3>

            {/* Facebook Page Plugin */}
            <div className="w-[280px] bg-white bg-opacity-5 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-orange-400 transition-all duration-300">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnike&tabs=timeline&width=280&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                width="280"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <p className="text-gray-400 text-sm mb-3">Connect with us:</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<Facebook size={18} />}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500"
                />
                <Button
                  icon={<Twitter size={18} />}
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-all hover:scale-110 hover:shadow-lg hover:shadow-sky-400"
                />
                <Button
                  icon={<Instagram size={18} />}
                  className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 rounded-full text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-3">We Accept:</p>
              <div className="flex flex-wrap gap-3">
                {/* VISA */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-white w-20 h-12 flex items-center justify-center rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border border-blue-100 hover:border-blue-300 p-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://logos-world.net/wp-content/uploads/2020/05/Visa-Logo-700x394.png"
                    alt="VISA"
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Mastercard */}
                <div className="group relative bg-gradient-to-br from-orange-50 to-white w-20 h-12 flex items-center justify-center rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border border-orange-100 hover:border-orange-300 p-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://logos-world.net/wp-content/uploads/2023/02/Masterpass-Logo-500x281.png"
                    alt="Mastercard"
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* PayPal */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-white w-20 h-12 flex items-center justify-center rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border border-blue-100 hover:border-blue-300 p-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://logos-world.net/wp-content/uploads/2023/01/PayPal-Logo-500x281.png"
                    alt="PayPal"
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
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
                fill="rgb(251 146 60)"
                className="animate-pulse text-orange-400"
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
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
