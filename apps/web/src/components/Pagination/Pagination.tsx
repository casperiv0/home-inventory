import { MAX_ITEMS_IN_TABLE } from "@lib/constants";
import { classes } from "@utils/classes";
import * as React from "react";
import styles from "./pagination.module.scss";

interface Props {
  length: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export function Pagination({ length, currentPage, setCurrentPage }: Props) {
  function calculatePages(itemsPerPage = MAX_ITEMS_IN_TABLE) {
    const arr = [];

    for (let i = 0; i < length; i++) {
      if (i % itemsPerPage === 0) {
        arr.push({ value: arr.length, text: arr.length + 1 });
      }
    }

    return arr;
  }

  const array = calculatePages();

  if (array.length <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationContainer}>
      {array.map((v, idx) => (
        <button
          onClick={() => setCurrentPage(v.value)}
          title={`Go to page: ${v.text}`}
          className={classes("btn", currentPage === v.value && styles.active)}
          key={v.value + idx}
        >
          {v.text}
        </button>
      ))}
    </div>
  );
}
