import { Truck, RefreshCw, Headphones, Shield } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-7 h-7 text-gray-700" />,
    title: "Free Delivery",
    description: "Free Shipping on all orders",
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-gray-700" />,
    title: "Return Policy",
    description: "30-day money back guarantee",
  },
  {
    icon: <Headphones className="w-7 h-7 text-gray-700" />,
    title: "24/7 Support",
    description: "We’re here to help anytime",
  },
  {
    icon: <Shield className="w-7 h-7 text-gray-700" />,
    title: "Secure Payment",
    description: "100% protected & safe checkout",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-10 sm:py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 shadow-md rounded-lg overflow-hidden">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center gap-2 py-8 sm:py-10 px-6 hover:bg-gray-50 transition-colors"
            >
              <div className="mb-2">{item.icon}</div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
