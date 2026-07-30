import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ShieldIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 4.8 6.2v5.3c0 4.5 2.9 7.7 7.2 9.5 4.3-1.8 7.2-5 7.2-9.5V6.2L12 3Z" />
    <path d="m9.4 12 1.7 1.7 3.8-4" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M20.2 15.4A8.4 8.4 0 0 1 8.6 3.8a8.5 8.5 0 1 0 11.6 11.6Z" />
  </svg>
);

export const SunIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M5 12h14M14 7l5 5-5 5" />
  </svg>
);

export const LinkIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M10 13a4.5 4.5 0 0 0 6.4.1l2-2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1" />
    <path d="M14 11a4.5 4.5 0 0 0-6.4-.1l-2 2a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1" />
  </svg>
);

export const UserIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 1.8" />
  </svg>
);

export const SparkIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="m12 3 1.3 4.2a5 5 0 0 0 3.4 3.4L21 12l-4.3 1.4a5 5 0 0 0-3.4 3.4L12 21l-1.3-4.2a5 5 0 0 0-3.4-3.4L3 12l4.3-1.4a5 5 0 0 0 3.4-3.4L12 3Z" />
  </svg>
);

export const SendIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="m21 3-7.4 18-3.5-7.1L3 10.4 21 3Z" />
    <path d="m10.1 13.9 4.4-4.4" />
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="8" y="8" width="11" height="11" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="m5 12 4.2 4.2L19 6.5" />
  </svg>
);

export const TrashIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
  </svg>
);

export const LockIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
  </svg>
);

export const UsersIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.4-3.5 2.2-5.2 5.5-5.2s5.1 1.7 5.5 5.2M16 5.6a3 3 0 0 1 0 5.8M17 14c2.1.6 3.3 2.3 3.5 5" />
  </svg>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const AlertIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M10.2 4.2 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.8 4.2a2 2 0 0 0-3.6 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

export const PaletteIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3a9 9 0 0 0 0 18h1.5a1.8 1.8 0 0 0 1.2-3.1 1.8 1.8 0 0 1 1.2-3.1H18a3 3 0 0 0 3-3C21 6.9 17 3 12 3Z" />
    <circle cx="7.5" cy="11" r=".8" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="7" r=".8" fill="currentColor" stroke="none" />
    <circle cx="14" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    <circle cx="17.2" cy="9.2" r=".8" fill="currentColor" stroke="none" />
  </svg>
);
