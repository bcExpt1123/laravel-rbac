import React, { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { PaginatedData, PaginatedFilter } from '@/types';
import { router } from '@inertiajs/react';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: PaginatedData<T>;
  columns: Column<T>[];
  pageSizeOptions?: number[];
  variant?: 'default' | 'striped' | 'bordered';
  className?: string;
  searchPlaceholder?: string;
  filter: PaginatedFilter;
  actions?: ReactNode;
  renderRowActions?: (item: T) => ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSizeOptions = [5, 10, 20, 50],
  variant = 'default',
  className = '',
  searchPlaceholder = 'Search...',
  filter,
  actions,
  renderRowActions
}: DataTableProps<T>) {
  const handleSearchChange = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    router.get(
      data.path,
      { search: e.target.value, perPage: filter?.perPage, page: data.current_page },
      { preserveState: true })
  }, 300);

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
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <Input
          type="search"
          aria-label="Search table"
          placeholder={searchPlaceholder}
          defaultValue={filter?.search}
          onChange={handleSearchChange}
          className="w-full sm:w-64"
        />
        {
          actions
            ?
            <div className='flex items-center space-x-2'>
              {actions}
            </div>
            : <></>
        }
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
              {
                renderRowActions
                  ?
                  <td>
                    Actions
                  </td>
                  : <></>
              }
            </tr>
          </thead>
          <tbody className={`${rowVariantClasses[variant]}`}>
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground dark:text-foreground">
                  No data found.
                </td>
              </tr>
            ) : (
              data.data.map((item, idx) => (
                <tr key={idx} tabIndex={0} className="focus:outline-none focus:bg-accent/20 dark:focus:bg-accent">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2 whitespace-nowrap text-sm text-foreground">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                  {
                    renderRowActions
                      ?
                      <td>
                        {renderRowActions(item)}
                      </td>
                      : <></>
                  }
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
        <div className='flex items-center space-x-2'>
          <Label htmlFor="pageSize" className="text-sm">
            Rows per page:
          </Label>
          <select
            id="pageSize"
            aria-label="Rows per page"
            value={data.per_page}
            onChange={(e) => {
              router.get(
                data.path,
                { search: filter?.search, perPage: e.target.value, page: data.current_page },
                { preserveState: true })
            }}
            className="px-2 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent dark:bg-background dark:text-foreground"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center space-x-2'>
          <span className="text-sm text-muted-foreground dark:text-foreground">
            Page {data.current_page} of {data.last_page}
          </span>
          {
            data.links.map(link => {
              return <Button
                key={link.label}
                onClick={() => {
                  if (link.url) {
                    router.get(
                      link.url,
                      { search: filter?.search, perPage: filter?.perPage ?? 10 },
                      { preserveState: true })
                  }
                }}
                disabled={!link.active}
                aria-label="Previous page"
                variant="outline"
                size="sm"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            })
          }
        </div>
      </nav>
    </div>
  );
}
