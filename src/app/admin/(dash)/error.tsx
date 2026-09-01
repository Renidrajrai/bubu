"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="font-display text-lg font-medium">something went wrong</h1>
      <p className="mt-2 text-sm text-text-secondary">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream"
      >
        try again
      </button>
    </div>
  );
}
