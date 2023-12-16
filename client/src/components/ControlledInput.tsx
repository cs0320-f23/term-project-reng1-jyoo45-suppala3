/**
 * @fileoverview This file contains the ControlledInput component,
 * which is a controlled input element specifically designed to handle
 * user inputs in a command-line style interface.
 */

import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";

/**
 * @interface ControlledInputProps
 * Defines the props for the ControlledInput component.
 *
 * @property {string} value - The current value of the input field, linked to a state variable.
 * @property {Dispatch<SetStateAction<string>>} setValue - Function to update the state linked to the input's value.
 * @property {string} ariaLabel - Accessible label for the input field, used for screen readers.
 * @property {number} focus - Numeric state to manage focus within the component.
 * @property {Dispatch<SetStateAction<number>>} setFocus - Function to update the focus state.
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
}

/**
 * ControlledInput is a React Functional Component that renders a controlled text input element.
 * It includes custom functionality to handle focus and tab key presses, making it suitable for
 * command-line style interfaces.
 *
 * @param {ControlledInputProps} props - The props for the ControlledInput component.
 * @returns {JSX.Element} A JSX element representing a controlled text input field.
 */
export function ControlledInput({
  value,
  setValue,
  ariaLabel,
  focus,
  setFocus,
}: ControlledInputProps) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Tab" && focus === 1) {
        event.preventDefault();
        ref.current?.focus();
        setFocus(0);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [focus]);

  return (
    <input
      type="text"
      className="repl-command-box"
      value={value}
      placeholder="start typing command..."
      onChange={(ev) => setValue(ev.target.value)}
      ref={ref}
      tabIndex={0}
      aria-label={ariaLabel}
    ></input>
  );
}
