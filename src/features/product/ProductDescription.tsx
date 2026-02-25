import { FiPackage } from "react-icons/fi";

interface Props {
  description?: string;
}

export default function ProductDescription({ description }: Props) {
  return (
    <div className="animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiPackage className="w-6 h-6 text-orange-500" />
        Product description
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="prose prose-lg text-gray-600 leading-relaxed">
          {description || "No description is available for this product."}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FiPackage className="w-16 h-16 mx-auto mb-3 text-orange-400" />
            <p className="font-medium">Hình ảnh minh họa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
