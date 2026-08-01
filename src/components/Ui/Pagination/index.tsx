import Link from "next/link";
import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string; // e.g., "/courses"
}

export function Pagination({
  totalPages,
  currentPage,
  baseUrl,
}: PaginationProps) {
  // if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Simple logic to show a window of pages
  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    end = Math.min(totalPages, 3);
  } else if (currentPage === totalPages) {
    start = Math.max(1, totalPages - 2);
  }

  const visiblePages = pages.slice(start - 1, end);

  const getPageUrl = (page: number) => {
    // If baseUrl already has query params, we need to append with & instead of ?
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
        className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
          currentPage > 1
            ? "border-card-border text-foreground hover:bg-[#222]"
            : "border-transparent text-text-subtle cursor-not-allowed opacity-50"
        } transition-all`}
        aria-disabled={currentPage <= 1}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>

      {/* First Page & Ellipsis */}
      {start > 1 && (
        <>
          <Link
            href={getPageUrl(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-card-border hover:bg-[#222] transition-all text-[14px]"
          >
            1
          </Link>
          {start > 2 && (
            <span className="text-text-subtle text-[14px]">...</span>
          )}
        </>
      )}

      {/* Visible Pages */}
      {visiblePages.map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-[14px] font-medium transition-all ${
            page === currentPage
              ? "bg-gold text-[#111] border-transparent"
              : "border border-card-border hover:bg-[#222]"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Last Page & Ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="text-text-subtle text-[14px]">...</span>
          )}
          <Link
            href={getPageUrl(totalPages)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-card-border hover:bg-[#222] transition-all text-[14px]"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
        className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
          currentPage < totalPages
            ? "border-card-border text-foreground hover:bg-[#222]"
            : "border-transparent text-text-subtle cursor-not-allowed opacity-50"
        } transition-all`}
        aria-disabled={currentPage >= totalPages}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    </div>
  );
}
