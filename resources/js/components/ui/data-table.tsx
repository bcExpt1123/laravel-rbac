import React, { useState, useMemo, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  variant?: 'default' | 'striped' | 'bordered';
  className?: string;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  darkMode?: boolean;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  variant = 'default',
  className = '',
  searchPlaceholder = 'Search...',
  onSearch,
  darkMode = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data;
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const value = item[col.key];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      })
    );
  }, [debouncedSearchTerm, data, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    if (onSearch) onSearch(e.target.value);
  }, [onSearch]);

  const handlePageSizeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let page = Number(e.target.value);
    if (isNaN(page) || page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  }, [totalPages]);

  const handlePageInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      let page = Number(target.value);
      if (isNaN(page) || page < 1) page = 1;
      else if (page > totalPages) page = totalPages;
      setCurrentPage(page);
      target.blur();
    }
  }, [totalPages]);

  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-background',
    striped: 'bg-white dark:bg-background',
    bordered: 'bg-white dark:bg-background border border-border dark:border-border',
  };

  const rowVariantClasses = {
    default: '',
    striped: 'odd:bg-gray-50 even:bg-white dark:odd:bg-muted/30 dark:even:bg-background',
    bordered: '',
  };

  return (
    <div className={`w-full ${className} ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <Input
          type="search"
          aria-label="Search table"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-64"
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="pageSize" className="text-sm">
            Rows per page:
          </Label>
          <select
            id="pageSize"
            aria-label="Rows per page"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent dark:bg-background dark:text-foreground"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <Label htmlFor="pageNumber" className="text-sm">
            Page:
          </Label>
          <Input
            id="pageNumber"
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            onKeyDown={handlePageInputKeyDown}
            aria-label="Page number"
            className="w-16"
          />
          <span className="text-sm text-muted-foreground dark:text-foreground">
            / {totalPages}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-border dark:divide-border ${variantClasses[variant]}`}
          role="table"
          aria-label="Data table"
        >
          <thead className="bg-muted dark:bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-muted-foreground dark:text-foreground uppercase tracking-wider select-none"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${rowVariantClasses[variant]}`}>
            {currentPageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground dark:text-foreground">
                  No data found.
                </td>
              </tr>
            ) : (
              currentPageData.map((item, idx) => (
                <tr key={idx} tabIndex={0} className="focus:outline-none focus:bg-accent/20 dark:focus:bg-accent">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2 whitespace-nowrap text-sm text-foreground">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <nav
        className="mt-4 flex items-center justify-between"
        role="navigation"
        aria-label="Pagination Navigation"
      >
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground dark:text-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </nav>
    </div>
  );
}
