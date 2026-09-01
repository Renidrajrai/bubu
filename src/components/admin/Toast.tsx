"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastItem = { id: number; message: string; type: "success" | "error" | "info" };
type ToastContextValue = {
  toast: (message: string, type?: ToastItem["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastItem["type"] = "info") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          {toasts.map((t) => (
            <button
              key={t.id}
              onClick={() => dismiss(t.id)}
              className={`pointer-events-auto rounded-lg px-3 py-2 text-xs shadow-[var(--shadow-soft)] transition-opacity hover:opacity-80 ${
                t.type === "error"
                  ? "bg-rose text-cream"
                  : t.type === "success"
                    ? "bg-cocoa text-cream"
                    : "bg-surface text-text-primary border border-border"
              }`}
            >
              {t.message}
            </button>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
