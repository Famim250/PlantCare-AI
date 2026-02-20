/**
 * Background Pattern Component
 * Subtle leaf pattern overlay for immersive premium feel
 */

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="leaf-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path
              d="M100 20c-15 0-25 10-25 30 0 15 5 25 15 35 0 0-20 5-20 30s20 35 30 35 30-15 30-35-20-30-20-30c10-10 15-20 15-35 0-20-10-30-25-30z"
              fill="#2F6F3E"
              opacity="0.4"
            />
            <path
              d="M50 150c-10 0-15 7-15 20 0 10 3 17 10 23 0 0-13 3-13 20s13 23 20 23 20-10 20-23-13-20-13-20c7-7 10-13 10-23 0-13-7-20-19-20z"
              fill="#2F6F3E"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
      </svg>
    </div>
  );
}
