import { useState } from "react";
import { Package, Star, MessageSquare } from "lucide-react";
import ProductDescription from "./ProductDescription";
import ProductSpecification from "./ProductSpecification";
import ProductReviews from "./ProductReviews";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductTabsProps {
  description?: string;
  specs?: Record<string, string>;
  reviews?: Review[];
}

export default function ProductTabs({
  description,
  specs,
  reviews,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specification" | "reviews"
  >("description");

  const tabs = [
    { id: "description", label: "Description", icon: Package },
    { id: "specification", label: "Specification", icon: Star },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-8 md:p-10">
        {activeTab === "description" && (
          <ProductDescription description={description} />
        )}
        {activeTab === "specification" && (
          <ProductSpecification specs={specs} />
        )}
        {activeTab === "reviews" && <ProductReviews reviews={reviews} />}
      </div>
    </div>
  );
}
