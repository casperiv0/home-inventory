import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowData,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import type { TablePaginationOptions } from "src/hooks/useTablePagination";
import { makeCheckboxHeader } from "./IndeterminateCheckbox";
import { TableFilter, TableFilters } from "./filters/TableFilters";
import type { UseQueryResult } from "react-query";

export interface TableFiltersStateProps {
  filters: TableFilter[];
  setFilters: React.Dispatch<React.SetStateAction<TableFilter[]>>;
}

interface Props<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  query?: UseQueryResult;
  filterTypes?: TableFilter[];
  pagination?: TablePaginationOptions;
  options?: {
    sorting?: SortingState;
    setSorting?: OnChangeFn<SortingState>;
    rowSelection?: RowSelectionState;
    setRowSelection?: OnChangeFn<RowSelectionState>;
    filters?: TableFilter[];
    setFilters?: React.Dispatch<React.SetStateAction<TableFilter[]>>;
  };
}

export function Table<TData extends RowData>({
  data,
  columns,
  pagination,
  filterTypes,
  query,
  options = {},
}: Props<TData>) {
  const tableColumns = React.useMemo(() => {
    let cols = columns;

    if (options.rowSelection) {
      cols = [makeCheckboxHeader(), ...cols];
    }

    return cols;
  }, [columns, options.rowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: options.setRowSelection,
    enableRowSelection: true,
    enableSorting: true,
    onSortingChange: options.setSorting,
    pageCount: pagination?.totalPageCount,
    manualSorting: true,
    state: {
      rowSelection: options.rowSelection,
      sorting: options.sorting,
    },
  });

  return (
    <div className="block max-w-full overflow-x-auto">
      {filterTypes && options.filters && options.setFilters ? (
        <TableFilters
          filterTypes={filterTypes}
          setFilters={options.setFilters}
          filters={options.filters}
          query={query}
        />
      ) : null}

      {(options.filters?.length ?? 0) >= 1 && data.length <= 0 ? (
        <p className="text-neutral-300">
          No results found with the selected filters. Please use a different query.
        </p>
      ) : (
        <>
          <table className="w-full overflow-x-hidden whitespace-nowrap max-h-64">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return <TableHeader key={header.id} header={header} />;
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} row={row} idx={idx} />
              ))}
            </tbody>
          </table>

          {pagination ? <TablePagination pagination={pagination} /> : null}
        </>
      )}
    </div>
  );
}
