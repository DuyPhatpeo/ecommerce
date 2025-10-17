import React from "react";

const Promo: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 md:py-10 bg-white">
      {/* Container: full width mobile, có lề nhỏ; giữ layout desktop */}
      <div className="w-full lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 lg:gap-8">
          {/* LEFT GROUP */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 sm:gap-6">
              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-48 bg-gray-50">
                <img
                  src="/c1.jpg"
                  alt="Giày 1"
                  className="h-full w-full object-cover sm:object-contain"
                />
              </div>

              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-48 bg-gray-50">
                <img
                  src="/c2.jpg"
                  alt="Giày 2"
                  className="h-full w-full object-cover sm:object-contain"
                />
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 sm:gap-6">
              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-48 bg-gray-50">
                <img
                  src="/c3.jpg"
                  alt="Giày 3"
                  className="h-full w-full object-cover sm:object-contain"
                />
              </div>

              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-48 bg-gray-50">
                <img
                  src="/c4.jpg"
                  alt="Giày 4"
                  className="h-full w-full object-cover sm:object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT BANNER */}
          <div className="flex justify-center items-center overflow-hidden h-64 sm:h-[360px] md:h-[420px] lg:h-[408px] w-full lg:w-auto bg-gray-50">
            <img
              src="/c5.jpg"
              alt="Banner"
              className="h-full w-full object-cover sm:object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promo;
