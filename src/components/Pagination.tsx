import React from 'react';
import Button from './ui/Button';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onExport?: () => void;
  exportDisabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
  onExport,
  exportDisabled = false
}) => {
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Calculate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page if there are multiple pages
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    let prev = 0;
    for (const page of uniqueRange) {
      if (page - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1 && !onExport) {
    return null;
  }

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.singleRow}>
        {/* Entry Info */}
        <div className={styles.entryInfo}>
          Showing {startEntry.toLocaleString()} to {endEntry.toLocaleString()} of {totalEntries.toLocaleString()} entries
        </div>

        {/* Pagination Controls - Only show if more than 1 page */}
        {totalPages > 1 && (
          <div className={styles.paginationControls}>
            {/* First Page */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              icon={<i className="fa-solid fa-angles-left" aria-label="First page" />}
            >
              <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                First
              </span>
            </Button>

            {/* Previous Page */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              icon={<i className="fa-solid fa-angle-left" aria-label="Previous page" />}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className={styles.pageNumbers}>
              {visiblePages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className={styles.dots}>
                      ...
                    </span>
                  );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`${styles.pageBtn} ${isActive ? styles.active : ''}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Next Page */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              icon={<i className="fa-solid fa-angle-right" aria-label="Next page" />}
              iconPosition="right"
            >
              Next
            </Button>

            {/* Last Page */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              icon={<i className="fa-solid fa-angles-right" aria-label="Last page" />}
            >
              <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                Last
              </span>
            </Button>
          </div>
        )}

        {/* Right side container */}
        <div className={styles.rightSection}>
          {/* Page Info Badge */}
          {totalPages > 1 && (
            <div className={styles.pageInfoContainer}>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          {/* Export Button */}
          {onExport && (
            <button
              onClick={onExport}
              disabled={exportDisabled}
              className={styles.exportBtn}
            >
              <i className="fas fa-download"></i>
              Export CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;