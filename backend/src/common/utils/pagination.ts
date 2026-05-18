export function clampPagination(
  page: number,
  limit: number,
  defaultLimit = 20,
  maxLimit = 100,
) {
  const clampedPage = Math.max(1, page || 1);
  const clampedLimit = Math.min(maxLimit, Math.max(1, limit || defaultLimit));
  return { page: clampedPage, limit: clampedLimit };
}
