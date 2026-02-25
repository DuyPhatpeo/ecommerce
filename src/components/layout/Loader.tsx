const Loader = () => {
  return (
    <div className="fixed inset-0 z-[999999] bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-xl"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-xl border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
