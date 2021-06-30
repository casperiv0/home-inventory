import * as React from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import styles from "./dropdown.module.scss";

interface DropdownOption {
  name: string;
  onClick?: () => void;
}

interface DropdownProps {
  options: DropdownOption[];
  children: React.ReactNode;

  isOpen: boolean;
  onClose: () => void;

  width?: string;
  autoFocus?: boolean;
}

const Dropdown = (props: DropdownProps) => {
  const focusRef = React.useRef<HTMLButtonElement>(null);
  const onOutsideRef = useOnclickOutside(props.onClose);

  React.useEffect(() => {
    if (props.autoFocus) {
      focusRef.current?.focus();
    }
  }, [props.autoFocus, props.isOpen]);

  return (
    <div ref={onOutsideRef} className={styles.dropdownContainer}>
      {props.children}

      {props.isOpen ? (
        <ul style={{ width: props.width }} className={styles.dropdownUl}>
          {props.options.map((v, idx) => {
            return (
              <li key={v.name}>
                <button ref={idx === 0 ? focusRef : null} onClick={v.onClick} className="btn">
                  {v.name}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default Dropdown;
