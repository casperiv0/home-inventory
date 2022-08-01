import type { GroupBase, StylesConfig } from "react-select";

export interface SelectTheme {
  backgroundColor?: string;
  color?: string;
}

export function styles({
  backgroundColor = "var(--hover-color)",
  color = "var(--dark)",
}: SelectTheme): StylesConfig<unknown, boolean, GroupBase<unknown>> {
  return {
    valueContainer: (base) => ({
      ...base,
      background: backgroundColor,
      color,
      ":hover": {
        border: "none",
      },
    }),
    option: (base) => ({
      ...base,
      padding: "0.5rem",
      width: "100%",
      backgroundColor,
      color,
      cursor: "pointer",
      transition: "filter 200ms",
      borderRadius: "0.2rem",
      marginTop: "0.2rem",
      ":hover": {
        filter: "brightness(80%)",
      },
    }),
    menu: (prov) => ({
      ...prov,
      width: "100%",
      color,
      padding: "0.5rem",
      backgroundColor,
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
    }),
    multiValue: (base) => ({
      ...base,
      color: "#cccccc",
      backgroundColor: "#cccccc",
      borderColor: "#cccccc",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color,
    }),
    multiValueLabel: (base) => ({
      ...base,
      backgroundColor: "#cccccc",
      color,
      padding: "0.2rem",
      borderRadius: "2px 0 0 2px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      backgroundColor: "#cccccc",
      color,
      borderRadius: "0 2px 2px 0",
      cursor: "pointer",
      ":hover": {
        filter: "brightness(90%)",
      },
    }),
    indicatorsContainer: (base) => ({
      ...base,
      backgroundColor,
      color,
    }),
    clearIndicator: (base) => ({
      ...base,
      cursor: "pointer",
      color,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      cursor: "pointer",
      color,
    }),
    control: (base, state) => ({
      ...base,
      background: backgroundColor,
      border: state.isFocused ? "2px solid #0a84ff" : `2px solid ${backgroundColor}`,
      boxShadow: "none",
      ":hover": {
        boxShadow: "none",
      },
      ":focus": {
        borderColor: "#0a84ff",
        boxShadow: "none",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color,
      opacity: "0.4",
    }),
    singleValue: (base) => ({
      ...base,
      color,
    }),
    input: (base) => ({
      ...base,
      color,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
}
