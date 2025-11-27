import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "./Button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-10 select-none">
      <Button
        onClick={handlePrev}
        disabled={currentPage === 1}
        icon={<FiChevronLeft size={18} />}
        className={`p-2 sm:p-2.5 rounded-lg border font-semibold transition ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-200 hover:bg-orange-100"
        }`}
      />

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          label={page}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border font-semibold transition ${
            page === currentPage
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-gray-700 border-gray-200 hover:bg-orange-100"
          }`}
        />
      ))}

      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        icon={<FiChevronRight size={18} />}
        className={`p-2 sm:p-2.5 rounded-lg border font-semibold transition ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-200 hover:bg-orange-100"
        }`}
      />
    </div>
  );
};

export default Pagination;
