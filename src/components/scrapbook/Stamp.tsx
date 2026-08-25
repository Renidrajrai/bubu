// Date/category stamp — scrapbook metadata display.
export default function Stamp({
  text,
  variant = "date",
  className = "",
}: {
  text: string;
  variant?: "date" | "category" | "location";
  className?: string;
}) {
  const colors = {
    date: "var(--cocoa-soft)",
    category: "var(--sage)",
    location: "var(--caramel)",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wide ${className}`}
      style={{
        color: colors[variant],
        border: `1px solid ${colors[variant]}40`,
      }}
    >
      {text}
    </span>
  );
}
