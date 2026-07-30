import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    // Adjust If We're Near The Beginning Or End
    if (currentPage <= halfVisible) {
      end = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {/* First Page */}
      {showFirstLast && currentPage > 2 && (
        <button
          onClick={() => onPageChange(1)}
          className="btn btn-sm btn-ghost"
          aria-label="First page"
        >
          1
        </button>
      )}

      {/* Ellipsis before */}
      {pages[0] > 2 && <span className="px-2 text-base-content/50">...</span>}

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-sm btn-ghost"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm ${
            page === currentPage ? "btn-primary" : "btn-ghost hover:bg-base-200"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-sm btn-ghost"
        aria-label="Next page"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>

      {/* Ellipsis after */}
      {pages[pages.length - 1] < totalPages - 1 && (
        <span className="px-2 text-base-content/50">...</span>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages - 1 && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="btn btn-sm btn-ghost"
          aria-label="Last page"
        >
          {totalPages}
        </button>
      )}
    </div>
  );
};

export default Pagination;
