// Page curl accent — scrapbook corner fold.
export default function PageCurl({
  size = 32,
  color = "var(--cream)",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M0 0 L32 0 L32 32 Z"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M32 0 L32 32 L0 0 Z"
        fill="var(--cloud)"
        opacity="0.4"
      />
    </svg>
  );
}
