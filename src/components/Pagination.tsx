import React from "react";

interface PaginationProps {
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ onNext, onPrev, hasNext, hasPrev }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;