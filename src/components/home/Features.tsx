import { Truck, RefreshCw, Headphones, Shield } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-7 h-7 text-gray-700" />,
    title: "Free Delivery",
    description: "Free Shipping on all order",
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-gray-700" />,
    title: "Return Policy",
    description: "Free Shipping on all order",
  },
  {
    icon: <Headphones className="w-7 h-7 text-gray-700" />,
    title: "24/7 Support",
    description: "Free Shipping on all order",
  },
  {
    icon: <Shield className="w-7 h-7 text-gray-700" />,
    title: "Secure Payment",
    description: "Free Shipping on all order",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 relative shadow-2xl rounded-lg">
          {features.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center space-y-2 py-10"
            >
              {item.icon}
              <h3 className="text-base font-medium text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.description}</p>

              {index < features.length - 1 && (
                <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
