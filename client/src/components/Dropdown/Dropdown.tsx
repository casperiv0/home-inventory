import * as React from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import styles from "./dropdown.module.scss";

interface DropdownOption {
  name: string;
  value?: string;
  onClick?: () => void;
}

interface DropdownProps {
  options: DropdownOption[];
  children: React.ReactNode;

  isOpen: boolean;
  onClose: () => void;

  closeOnClick?: boolean;
  width?: string;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

const Dropdown = (props: DropdownProps) => {
  const focusRef = React.useRef<HTMLButtonElement>(null);
  const onOutsideRef = useOnclickOutside(props.onClose);

  function handleClick(v: DropdownOption) {
    v.onClick?.();

    if (props.closeOnClick) {
      props.onClose();
    }
  }

  React.useEffect(() => {
    if (props.autoFocus) {
      focusRef.current?.focus();
    }
  }, [props.autoFocus, props.isOpen]);

  return (
    <div style={props.style} ref={onOutsideRef} className={styles.dropdownContainer}>
      {props.children}

      {props.isOpen ? (
        <ul style={{ width: props.width }} className={styles.dropdownUl}>
          {props.options.map((v, idx) => {
            return (
              <li key={v.name}>
                <button
                  ref={idx === 0 ? focusRef : null}
                  onClick={handleClick.bind(null, v)}
                  className="btn"
                >
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
