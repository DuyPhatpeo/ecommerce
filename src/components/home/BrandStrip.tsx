import React from "react";

const BrandStrip: React.FC = () => {
  const brands = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
        <div
          className="
            grid grid-cols-2 sm:grid-cols-3 lg:flex 
            flex-wrap lg:justify-center lg:gap-x-14
            gap-x-8 gap-y-8 items-center justify-items-center
          "
        >
          {brands.map((src, i) => {
            const isLastOdd =
              brands.length % 2 !== 0 && i === brands.length - 1;
            return (
              <div
                key={i}
                className={`flex justify-center
                  ${
                    isLastOdd
                      ? "col-span-2 sm:col-span-1 justify-center sm:justify-start"
                      : ""
                  }
                `}
              >
                <img
                  src={src}
                  alt={`brand-${i}`}
                  className="
                    h-12 sm:h-10 md:h-12 lg:h-14  
                    opacity-50 hover:opacity-100
                    grayscale hover:grayscale-0
                    transition-all duration-300 ease-in-out
                    cursor-pointer
                    flex-shrink-0
                  "
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;
