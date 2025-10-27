import React from "react";

const Promo: React.FC = () => {
  return (
    <section className="py-10 bg-white">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 lg:gap-6">
          {/* LEFT GROUP */}
          <div className="flex flex-col gap-4 w-full lg:w-auto md:items-center">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start md:justify-center gap-3 sm:gap-4">
              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-52 bg-gray-50">
                <img
                  src="/c1.jpg"
                  alt="Giày 1"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-52 bg-gray-50">
                <img
                  src="/c2.jpg"
                  alt="Giày 2"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start md:justify-center gap-3 sm:gap-4">
              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-52 bg-gray-50">
                <img
                  src="/c3.jpg"
                  alt="Giày 3"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex justify-center items-center overflow-hidden w-full sm:w-auto h-52 bg-gray-50">
                <img
                  src="/c4.jpg"
                  alt="Giày 4"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT BANNER */}
          <div className="flex justify-center items-center overflow-hidden w-full lg:w-auto bg-gray-50 h-[436px] sm:h-[440px] md:h-[436px]">
            <img
              src="/c5.jpg"
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promo;
