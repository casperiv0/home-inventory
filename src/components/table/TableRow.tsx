import { flexRender, Row, RowData } from "@tanstack/react-table";
import { classNames } from "utils/classNames";

interface Props<TData extends RowData> {
  row: Row<TData>;
  idx: number;
  isSelected?: boolean;
}

export function TableRow<TData extends RowData>({ isSelected, row, idx }: Props<TData>) {
  return (
    <tr
      className={classNames(
        "border-b-2 border-secondary",
        "hover:bg-secondary/60",
        isSelected && "brightness-150",
        "transition",
      )}
      data-row-index={idx}
      key={row.id}
    >
      {row.getVisibleCells().map((cell) => {
        const cellValue =
          cell.column.id === "select" ? cell.column.columnDef.cell : cell.getValue<any>();

        return (
          <td
            className={classNames(
              "first:px-5 m-0 text-left p-3 px-3",
              cell.column.id === "actions" && "w-[100px] text-end",
            )}
            key={cell.id}
          >
            {flexRender(cellValue, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
