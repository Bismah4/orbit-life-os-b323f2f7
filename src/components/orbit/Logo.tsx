export const OrbitLogo = ({ size = 96 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(212 100% 70%)" />
        <stop offset="100%" stopColor="hsl(200 100% 75%)" />
      </linearGradient>
    </defs>
    <circle cx="48" cy="48" r="14" fill="url(#og)" />
    <ellipse cx="48" cy="48" rx="38" ry="14" stroke="url(#og)" strokeWidth="2" opacity="0.85" transform="rotate(-25 48 48)" />
    <ellipse cx="48" cy="48" rx="38" ry="14" stroke="url(#og)" strokeWidth="1.5" opacity="0.45" transform="rotate(35 48 48)" />
    <circle cx="82" cy="32" r="3" fill="hsl(200 100% 80%)" />
  </svg>
);
