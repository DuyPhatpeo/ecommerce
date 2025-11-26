import { Truck, RefreshCw, Headphones, Shield } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-10 h-10 text-gray-700" />,
    title: "Free Delivery",
    description: "Free Shipping on all orders",
  },
  {
    icon: <RefreshCw className="w-10 h-10 text-gray-700" />,
    title: "Return Policy",
    description: "30-day money back guarantee",
  },
  {
    icon: <Headphones className="w-10 h-10 text-gray-700" />,
    title: "24/7 Support",
    description: "We're here to help anytime",
  },
  {
    icon: <Shield className="w-10 h-10 text-gray-700" />,
    title: "Secure Payment",
    description: "100% protected & safe checkout",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-12 md:py-20 border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 rounded-lg overflow-hidden">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center py-10 px-6 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
