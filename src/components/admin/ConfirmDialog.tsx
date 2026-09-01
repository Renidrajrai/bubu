"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "confirm",
  cancelLabel = "cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-w-sm flex-col gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-sm font-medium">{title}</h2>
        <p className="text-xs text-text-secondary">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-full px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-3 py-1.5 text-xs font-medium text-cream ${
              danger ? "bg-rose" : "bg-cocoa"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
