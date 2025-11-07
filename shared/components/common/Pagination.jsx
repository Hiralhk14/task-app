export default function Pagination({
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  maxButtons = 5,
  className = ''
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const getVisiblePages = () => {
    const visibleCount = Math.min(maxButtons, totalPages);
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
    let end = start + visibleCount - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visibleCount + 1);
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  const handleChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange?.(page);
  };

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => handleChange(currentPage - 1)}
        disabled={isFirst}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
          isFirst
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        Previous
      </button>

      <div className="flex space-x-1">
        {getVisiblePages().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handleChange(page)}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleChange(currentPage + 1)}
        disabled={isLast}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
          isLast
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        Next
      </button>
    </div>
  );
}

