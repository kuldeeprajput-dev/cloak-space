import Link from "next/link";

export const Brand = ({ compact = false }: { compact?: boolean }) => (
  <Link
    href="/"
    className="inline-flex items-center gap-2.5 font-[750] tracking-[-0.04em] text-[var(--text)] no-underline"
    aria-label="Cloak home"
  >
    <span
      className={`shrink-0 ${
        compact ? "size-8 max-[680px]:size-[37px]" : "size-9"
      }`}
    >
      <svg viewBox="0 0 64 64" fill="none" className="block size-full">
        <path
          d="M42.5 21.5A15.2 15.2 0 0 0 32 17.3c-8.7 0-15.7 6.6-15.7 14.7S23.3 46.7 32 46.7c4 0 7.7-1.4 10.5-4.2"
          className="stroke-[var(--text)] transition-colors duration-150"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M38.5 32H49"
          className="stroke-[var(--text)] transition-colors duration-150"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <circle
          cx="49"
          cy="32"
          r="3"
          className="fill-[var(--text)] transition-colors duration-150"
        />
      </svg>
    </span>
    <span
      className={
        compact ? "text-base max-[680px]:hidden" : "text-lg"
      }
    >
      cloak
    </span>
  </Link>
);
