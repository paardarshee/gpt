"use client";
import DynamicTextArea from "./DynamicTextArea";

export default function EditMessage({
  value,
  onChange,
  onCancel,
  onSend,
}: {
  value: string;
  onChange: (val: string) => void;
  onCancel: () => void;
  onSend: () => void;
}) {
  return (
    <div className="bg-bg-tertiary mt-1 flex w-full flex-col gap-2 rounded-2xl p-3">
      <DynamicTextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          className="bg-bg-primary hover:bg-bg-secondary cursor-pointer rounded-full px-2.5 py-1.5 text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-bg-primary-inverted text-text-inverted cursor-pointer rounded-full px-2.5 py-1.5 text-sm"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
