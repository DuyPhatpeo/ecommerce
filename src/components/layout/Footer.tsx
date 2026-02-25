import { useState } from "react";
import { FiSend, FiHeart, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email.trim() !== "") {
      alert(`Thanks for subscribing with: ${email}`);
      setEmail("");
    }
  };
  const footerLinks = [
    { label: "About Us", link: "/about-us" },
    { label: "FAQ", link: "/faq" },
    { label: "Our Services", link: "/services" },
    { label: "Blog", link: "/blog" },
  ];
  return (
    <footer
      className="relative text-gray-300 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-16 py-35 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* ---------------- ABOUT ---------------- */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-xl relative inline-block pb-3">
              About
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500" />
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed hover:text-gray-200 transition-colors duration-300">
              We are passionate about delivering the best products and services
              to our customers. Join our community and stay connected with the
              latest trends and updates.
            </p>

            <div className="flex gap-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                <FiHeart size={18} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Quality First
                </p>
                <p className="text-gray-500 text-xs">Since 2020</p>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-orange-400 transition-colors duration-300 cursor-pointer"
              >
                <FiPhone size={16} className="flex-shrink-0" />
                <span>+1 234 567 890</span>
              </a>
              <a
                href="mailto:info@company.com"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-orange-400 transition-colors duration-300 cursor-pointer"
              >
                <FiMail size={16} className="flex-shrink-0" />
                <span>info@company.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm hover:text-orange-400 transition-colors duration-300 cursor-pointer">
                <FiMapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Business St, City, Country</span>
              </div>
            </div>
          </div>

          {/* ---------------- NEWSLETTER ---------------- */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-xl relative inline-block pb-3">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500" />
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Stay updated with our latest news and exclusive offers delivered
              to your inbox.
            </p>

            {/* Modern Input */}
            <div className="flex max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/40 backdrop-blur-sm shadow-lg hover:border-orange-400 transition-all duration-300">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-white bg-transparent text-sm placeholder-gray-500 outline-none"
              />

              <button
                onClick={handleSubscribe}
                aria-label="Subscribe to newsletter"
                className="cursor-pointer px-5 py-3 text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 flex items-center justify-center"
              >
                <FiSend size={16} />
              </button>
            </div>

            <div className="pt-4">
              <h4 className="text-white font-semibold text-sm mb-4">
                Quick Links
              </h4>

              <ul className="grid grid-cols-2 gap-3">
                {footerLinks.map(({ label, link }) => (
                  <li key={label}>
                    <a
                      href={link}
                      className="text-gray-400 text-sm hover:text-orange-400 hover:pl-2 transition-all duration-300 block"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------------- FOLLOW US ---------------- */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-xl relative inline-block pb-3">
              Follow Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500" />
            </h3>

            {/* FB Plugin */}
            <div className="w-full max-w-[280px] bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-orange-400 transition-colors duration-300">
              <iframe
                title="Facebook page plugin"
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnike&tabs=timeline&width=280&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                width="280"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            <div className="pt-2">
              <p className="text-gray-400 text-sm mb-4">Connect with us:</p>

              <div className="flex flex-wrap gap-3">
                <button
                  aria-label="Follow us on Facebook"
                  className="cursor-pointer w-11 h-11 rounded-2xl text-white bg-blue-600 transition-all duration-300 hover:scale-110 hover:bg-blue-700 shadow-md hover:shadow-blue-500/40 flex items-center justify-center"
                >
                  <FaFacebook size={18} />
                </button>

                <button
                  aria-label="Follow us on Twitter"
                  className="cursor-pointer w-11 h-11 rounded-2xl text-white bg-sky-500 transition-all duration-300 hover:scale-110 shadow-md hover:bg-sky-600 hover:shadow-sky-400/40 flex items-center justify-center"
                >
                  <FaTwitter size={18} />
                </button>

                <button
                  aria-label="Follow us on Instagram"
                  className="cursor-pointer w-11 h-11 rounded-2xl text-white bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] transition-all duration-300 hover:scale-110 shadow-md hover:shadow-pink-500/40 flex items-center justify-center"
                >
                  <FaInstagram size={18} />
                </button>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-4">We Accept:</p>

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
                    className={`relative ${card.bg} bg-gradient-to-br ${card.gradient} border ${card.border} w-16 h-10 rounded-xl flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden p-2`}
                  >
                    <img
                      src={card.src}
                      alt={`Pay with ${card.alt}`}
                      className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- BOTTOM ---------------- */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5">
              © 2025 Made with
              <FiHeart
                size={14}
                fill="rgb(251 146 60)"
                className="text-orange-400 animate-pulse"
              />
              by
              <a
                href="https://github.com/DuyPhatpeo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 font-semibold hover:text-orange-300 underline underline-offset-2 transition-colors duration-300"
              >
                DuyPhat
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300"
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
