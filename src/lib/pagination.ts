export const PAGE_SIZE = 12; // divides evenly into 1, 2, and 3-column card grids

export interface PaginationResult<T> {
  pageItems: T[];
  totalPages: number;
  rangeStart: number; // 1-indexed, 0 when items is empty
  rangeEnd: number;
}

export function paginate<T>(items: T[], page: number): PaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  // Clamp rather than trust `page`: the caller's page state can legitimately
  // point past the end of a set that just got smaller (e.g. broadening a
  // filter shrinks totalPages while `page` hasn't been told yet, however
  // briefly between renders). Clamping here means paginate() always returns
  // a valid, non-empty-when-possible page on its own, instead of every
  // caller having to pre-validate `page` before calling it.
  const clampedPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (clampedPage - 1) * PAGE_SIZE;
  const pageItems = items.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    pageItems,
    totalPages,
    rangeStart: items.length === 0 ? 0 : startIndex + 1,
    rangeEnd: Math.min(startIndex + PAGE_SIZE, items.length),
  };
}
