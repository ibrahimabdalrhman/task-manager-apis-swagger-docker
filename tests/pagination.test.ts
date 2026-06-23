import { parsePaginationQuery, buildPaginatedResult } from '../src/utils/pagination';

describe('pagination utils', () => {
  describe('parsePaginationQuery', () => {
    it('should return defaults when query is empty', () => {
      const result = parsePaginationQuery({});
      expect(result).toEqual({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
    });

    it('should parse custom pagination values', () => {
      const result = parsePaginationQuery({
        page: '2',
        limit: '25',
        sortBy: 'title',
        sortOrder: 'ASC',
      });
      expect(result).toEqual({
        page: 2,
        limit: 25,
        sortBy: 'title',
        sortOrder: 'ASC',
      });
    });

    it('should cap limit at 100', () => {
      const result = parsePaginationQuery({ limit: '500' });
      expect(result.limit).toBe(100);
    });

    it('should enforce minimum page of 1', () => {
      const result = parsePaginationQuery({ page: '-5' });
      expect(result.page).toBe(1);
    });
  });

  describe('buildPaginatedResult', () => {
    it('should build correct pagination metadata', () => {
      const result = buildPaginatedResult(['a', 'b'], 25, 2, 10);
      expect(result).toEqual({
        data: ['a', 'b'],
        meta: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3,
        },
      });
    });

    it('should return at least 1 total page when total is 0', () => {
      const result = buildPaginatedResult([], 0, 1, 10);
      expect(result.meta.totalPages).toBe(1);
    });
  });
});
