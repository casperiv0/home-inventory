import { flexRender, Header, RowData } from "@tanstack/react-table";
import { classNames } from "utils/classNames";
import { ArrowDownSquareFill } from "react-bootstrap-icons";

interface Props<TData extends RowData> {
  header: Header<TData, any>;
}

export function TableHeader<TData extends RowData>({ header }: Props<TData>) {
  const canSort = header.id === "actions" ? false : header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();

  return (
    <th
      className={classNames(
        "p-3 px-3 bg-secondary border-b-[1.5px] border-secondary text-neutral-300 font-semibold text-xs text-left select-none",
        "first:px-5 uppercase last:rounded-tr-sm first:rounded-tl-sm",
        canSort && "cursor-pointer select-none",
        header.id === "actions" && "w-[100px] text-end",
      )}
      key={header.id}
      colSpan={header.colSpan}
      data-column-index={header.index}
      onClick={(event) => {
        if (!canSort) return;
        header.column.getToggleSortingHandler()?.(event);
      }}
    >
      <span className="flex items-center gap-3">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header as any, header.getContext())}
        {sortDirection ? (
          <span>
            <ArrowDownSquareFill
              className="transition-transform duration-75"
              style={{ transform: sortDirection === "desc" ? "" : "rotate(-180deg)" }}
              width={15}
              height={15}
            />
          </span>
        ) : null}
      </span>
    </th>
  );
}
