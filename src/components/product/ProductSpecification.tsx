import { Star } from "lucide-react";

interface Props {
  specs?: Record<string, string>;
}

export default function ProductSpecification({ specs }: Props) {
  return (
    <div className="animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Star className="w-6 h-6 text-orange-500" />
        Thông số kỹ thuật
      </h3>
      {specs && Object.keys(specs).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(specs).map(([key, value], idx) => (
            <div
              key={key}
              className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-600 font-bold rounded-lg w-8 h-8 flex items-center justify-center text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <strong className="capitalize text-gray-800 block mb-1">
                    {key}
                  </strong>
                  <span className="text-gray-600">{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Star className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">
            Không có thông số kỹ thuật.
          </p>
        </div>
      )}
    </div>
  );
}
