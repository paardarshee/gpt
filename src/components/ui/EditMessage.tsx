"use client";
import DynamicTextArea from "./DynamicTextArea";

type EditMessageProps = {
  value: string;
  onChange: (val: string) => void;
  onCancel: () => void;
  onSend: () => void;
};

/**
 * EditMessage
 * A UI component for editing an existing message.
 * Provides textarea input, cancel, and send buttons.
 */
export default function EditMessage({
  value,
  onChange,
  onCancel,
  onSend,
}: EditMessageProps) {
  return (
    <div
      className="bg-bg-tertiary mt-1 flex w-full flex-col gap-2 rounded-2xl p-3"
      role="form"
      aria-label="Edit message"
    >
      {/* Textarea for editing message */}
      <DynamicTextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Edit message input"
      />

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="bg-bg-primary hover:bg-bg-secondary cursor-pointer rounded-full px-2.5 py-1.5 text-sm"
          onClick={onCancel}
          aria-label="Cancel editing"
        >
          Cancel
        </button>
        <button
          type="button"
          className="bg-bg-primary-inverted text-text-inverted cursor-pointer rounded-full px-2.5 py-1.5 text-sm"
          onClick={onSend}
          aria-label="Send edited message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
