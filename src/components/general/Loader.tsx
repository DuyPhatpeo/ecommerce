const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading text with pulse animation */}
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Đang tải...
        </p>

        {/* Dots animation */}
        <div className="flex justify-center gap-1 mt-3">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
