export type IconProps = { className?: string };

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function WildflowerIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* five soft petals radiating from center */}
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <ellipse cx="20" cy="10" rx="3.2" ry="5.4" />
        <ellipse cx="20" cy="10" rx="3.2" ry="5.4" transform="rotate(72 20 20)" />
        <ellipse cx="20" cy="10" rx="3.2" ry="5.4" transform="rotate(144 20 20)" />
        <ellipse cx="20" cy="10" rx="3.2" ry="5.4" transform="rotate(216 20 20)" />
        <ellipse cx="20" cy="10" rx="3.2" ry="5.4" transform="rotate(288 20 20)" />
      </g>
      {/* center bud */}
      <circle cx="20" cy="20" r="2.6" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
