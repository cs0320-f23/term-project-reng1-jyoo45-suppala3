import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";

/**
 * ControlledInputProps interface
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
}

/**
 * returns controlled input from command input box
 * @param param0
 * @returns jsx of the input
 */
export function ControlledInput({
  value,
  setValue,
  ariaLabel,
  focus, 
  setFocus
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
