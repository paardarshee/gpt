"use client";
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEventHandler,
} from "react";
import TextareaAutosize from "react-textarea-autosize";

interface DynamicTextAreaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onLineCountChange?: (lineCount: number) => void;
  isMultiline?: boolean;
}

const DynamicTextArea: React.FC<DynamicTextAreaProps> = ({
  value,
  onChange,
  placeholder = "",
  onKeyDown,
  onLineCountChange,
  isMultiline = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [maxRows, setMaxRows] = useState<number>(5);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);

    if (textareaRef.current && onLineCountChange) {
      const el = textareaRef.current;
      const computedStyle = window.getComputedStyle(el);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const lineCount = Math.floor(el.scrollHeight / lineHeight);
      onLineCountChange(lineCount);
    }
  };

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const updateMaxRows = () => {
      if (textareaRef.current) {
        const computedStyle = window.getComputedStyle(textareaRef.current);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const targetHeight = window.innerHeight * 0.3;
        const newMaxRows = Math.floor(targetHeight / lineHeight) || 1;
        setMaxRows(newMaxRows);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMaxRows, 150); // only run after user stops resizing for 150ms
    };

    updateMaxRows(); // initial run
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      const length = value.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultiline]);

  return (
    <TextareaAutosize
      ref={textareaRef}
      minRows={1}
      maxRows={maxRows}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      style={{
        width: "100%",
        fontSize: "18px",
        padding: "8px 4px",
        boxSizing: "border-box",
      }}
      className="resize-none border-0 outline-0"
    />
  );
};

export default DynamicTextArea;
