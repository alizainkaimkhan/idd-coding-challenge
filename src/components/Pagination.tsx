interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav
      aria-label="Course list pagination"
      className="flex items-center justify-center gap-4 mt-6"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="min-w-11 min-h-11 px-4 py-2 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <span aria-live="polite" className="text-sm text-foreground/70">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="min-w-11 min-h-11 px-4 py-2 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
}
