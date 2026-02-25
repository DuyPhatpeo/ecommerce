import {
  FaShippingFast,
  FaShieldAlt,
  FaStar,
  FaHeart,
  FaAward,
  FaHandshake,
} from "react-icons/fa";

export default function AboutUs() {
  const values = [
    {
      icon: <FaShippingFast className="w-12 h-12" />,
      title: "Fast Delivery",
      description:
        "Quick and reliable shipping to get your favorite shoes to you promptly",
    },
    {
      icon: <FaShieldAlt className="w-12 h-12" />,
      title: "Quality Guarantee",
      description:
        "100% authentic products with comprehensive warranty coverage",
    },
    {
      icon: <FaStar className="w-12 h-12" />,
      title: "Premium Selection",
      description: "Curated collection of top brands and latest styles",
    },
    {
      icon: <FaHeart className="w-12 h-12" />,
      title: "Customer First",
      description:
        "Dedicated support team always ready to help you find the perfect fit",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "200+", label: "Shoe Brands" },
    { number: "10K+", label: "Products Available" },
    { number: "5+", label: "Years in Business" },
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="text-center mb-16">
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Karma, we believe every step matters. We're passionate about
            bringing you the finest footwear from around the world, combining
            style, comfort, and quality to help you walk confidently through
            life's journey.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-orange-200"
            >
              <div className="text-orange-500 flex justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-[#f8f6f3] rounded-2xl p-12 mb-20">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Shop at Karma?
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <FaAward className="text-orange-500 w-8 h-8 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Authentic Products Only
                </h3>
                <p className="text-gray-600">
                  Every pair of shoes is sourced directly from authorized
                  distributors, ensuring 100% authenticity and original quality
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <FaHandshake className="text-orange-500 w-8 h-8 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Easy Returns & Exchanges
                </h3>
                <p className="text-gray-600">
                  Not the right fit? No problem! We offer hassle-free returns
                  and exchanges within 30 days of purchase
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="mt-20 max-w-4xl mx-auto mb-5">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Our Story
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2019, Karma Shoes started with a simple mission: to make
            premium footwear accessible to everyone. What began as a small
            online store has grown into a trusted destination for shoe lovers
            across the country.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, we're proud to offer an extensive collection featuring
            everything from athletic sneakers and casual loafers to elegant
            heels and rugged boots. Our team carefully selects each product to
            ensure it meets our high standards for quality, style, and value.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16 px-6 border-t-2 border-orange-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Explore our collection and step into comfort and style
          </p>
          <a href="/contact">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-orange-500/30">
              Contact Us
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
