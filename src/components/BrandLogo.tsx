import Link from "next/link";

function ShieldMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <span className={`relative grid place-items-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_0_18px_rgba(94,234,212,0.22)]">
        <defs>
          <linearGradient id="agentShieldMark" x1="12" y1="8" x2="52" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7cf7dc" />
            <stop offset="0.48" stopColor="#4fd1c5" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M32 5 54 14v16c0 14.5-8.7 24.4-22 29-13.3-4.6-22-14.5-22-29V14L32 5Z"
          fill="#07111f"
          stroke="url(#agentShieldMark)"
          strokeWidth="3"
        />
        <path d="M21 40 32 16l11 24h-6l-2.1-5.2h-9.8L23 40h-2Zm6.8-11h8.4L32 18.8 27.8 29Z" fill="#e5edf8" />
        <path d="M18 45h28" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
        <circle cx="49" cy="20" r="3" fill="#fbbf24" />
      </svg>
    </span>
  );
}

export function BrandLogo({ large = false }: { large?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <ShieldMark className={large ? "h-16 w-16" : "h-12 w-12"} />
      <span>
        <span className={large ? "block text-3xl font-black leading-none text-white" : "block text-2xl font-black leading-none text-white"}>
          AgentShield
        </span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          Agent security control plane
        </span>
      </span>
    </Link>
  );
}
