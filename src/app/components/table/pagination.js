import { useMemo } from "react";
import { Text } from "../typography";

const Pagination = ({ page, total, onPageChange, pageSize = 10 }) => {
  const totalPages = Math.ceil(total / pageSize);

  const constraints = useMemo(() => {
    return { start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, total) }
  }, [page, pageSize, total]);

  const onDecrement = () => {
    const p = page - 1;
    onPageChange(p < 1 ? 1 : p > totalPages ? totalPages : p);
  }

  const onIncrement = () => {
    const p = page + 1;
    onPageChange(p < 1 ? 1 : p > totalPages ? totalPages : p);
  }

  const pagesToShow = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 1) {
      return [1, 2, 3];
    }
    if (page >= totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [page - 1, page, page + 1];
  }, [page, totalPages]);

  return (
    <div className="d-flex align-items-center justify-content-between gap-4">
      <Text size="paragraph-xs">{constraints.start} - {constraints.end} of {total}</Text>

      <div className="d-flex align-items-center gap-2">
        <button
          onClick={onDecrement}
          disabled={page <= 1}
          className="d-flex align-items-center justify-content-center qb-pagination-btn qb-cursor-pointer qb-br-8 qb-border-solid-muted"
        >
          <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 7L0 3.5L3.5 0L4.31667 0.816667L1.63333 3.5L4.31667 6.18333L3.5 7Z" className={page <= 1 ? "qb-fill-muted" : "qb-fill-dark"} />
          </svg>
        </button>

        {pagesToShow.map((p) => (
          <button
            key={p}
            onClick={() => { if (p != page) onPageChange(p) }}
            className={`d-flex align-items-center justify-content-center qb-pagination-btn qb-cursor-pointer qb-br-8 qb-border-solid-muted ${page === p ? "qb-bg-dark qb-text-light" : ""}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={onIncrement}
          disabled={page >= totalPages}
          className="d-flex align-items-center justify-content-center qb-pagination-btn qb-cursor-pointer qb-br-8 qb-border-solid-muted"
        >
          <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.68333 3.5L0 0.816667L0.816667 0L4.31667 3.5L0.816667 7L0 6.18333L2.68333 3.5Z" className={page >= totalPages ? "qb-fill-muted" : "qb-fill-dark"} />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pagination;