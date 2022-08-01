import ReactSelect, { Props as SelectProps } from "react-select";
import React from "react";
import { styles, SelectTheme } from "./styles";

export interface SelectValue<TValue = string> {
  value: TValue;
  label: string;
}

interface Props {
  onChange(v: SelectValue<any>): void;
  options: SelectProps["options"];
  defaultValue?: SelectProps["defaultValue"];
  value?: SelectProps["value"];
  onFocus?: SelectProps["onFocus"];
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  id?: string;
  theme?: SelectTheme;
}

export const Select = ({
  onChange,
  onFocus,
  isMulti = false,
  closeMenuOnSelect,
  options,
  defaultValue,
  value,
  isClearable = false,
  disabled,
  id,
  theme,
}: Props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <ReactSelect
      id={id}
      isClearable={isClearable}
      onFocus={onFocus ? onFocus : () => setMenuOpen(true)}
      value={value}
      isSearchable
      isMulti={typeof isMulti !== "undefined" ? isMulti : true}
      styles={styles(theme ?? {})}
      onChange={(newValue: any) => onChange(newValue)}
      options={options}
      defaultValue={defaultValue}
      closeMenuOnSelect={closeMenuOnSelect}
      menuIsOpen={menuOpen}
      onMenuClose={() => setMenuOpen(false)}
      onMenuOpen={() => setMenuOpen(true)}
      onBlur={() => setMenuOpen(false)}
      isDisabled={disabled}
      menuPortalTarget={document.body}
      menuShouldScrollIntoView={false}
    />
  );
};
