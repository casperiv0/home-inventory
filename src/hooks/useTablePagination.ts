import * as React from "react";
import type { UseQueryResult } from "react-query";

interface Options<T extends { maxPages: number }> {
  isLoading: boolean;
  query: UseQueryResult<T>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface TablePaginationOptions {
  isLoading: boolean;
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
  currentPage: number;
  totalPageCount: number;
  onNextPage(): void;
  onPreviousPage(): void;
  gotoPage(page: number): void;
}

export function useTablePagination<T extends { maxPages: number }>(
  options: Options<T>,
): TablePaginationOptions {
  const isNextDisabled = options.query.isLoading || options.page === options.query.data?.maxPages;
  const isPreviousDisabled = options.query.isLoading || options.page <= 0;

  function onNextPage() {
    options.setPage((prevPage) =>
      prevPage === options.query.data?.maxPages ? prevPage : prevPage + 1,
    );
  }

  function onPreviousPage() {
    options.setPage((prevPage) => (prevPage <= 0 ? 0 : prevPage - 1));
  }

  function gotoPage(page: number) {
    options.setPage(page);
  }

  React.useEffect(() => {
    if (!options.isLoading) {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  }, [options.isLoading, options.query.data]);

  return {
    isLoading: options.isLoading,
    totalPageCount: options.query.data?.maxPages ?? 0,
    currentPage: options.page,
    isNextDisabled,
    isPreviousDisabled,
    onNextPage,
    onPreviousPage,
    gotoPage,
  };
}
