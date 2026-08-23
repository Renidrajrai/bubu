// Hand-drawn connector between scenes (spec §22/23). Static for Phase 5;
// Phase 7 links the reveal to scroll progress.
export default function Connector({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex justify-center py-2 ${className}`}>
      <svg
        viewBox="0 0 120 180"
        fill="none"
        className="h-36 w-auto text-deep-sage/50"
      >
        <path
          d="M62 6C48 30 76 48 60 72c-14 21 12 39-4 60-8 10-4 24 8 34m4-142c14 24-14 42 2 66 14 21-12 39 4 60m0 8 7-9m-7 9-8-8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 9"
        />
      </svg>
    </div>
  );
}
