type RiskGaugeSize = "sm" | "md" | "lg";

function getRiskBand(score: number) {
  if (score >= 81) {
    return { label: "Critical", tone: "#dc2626", track: "rgba(220, 38, 38, 0.2)", direction: "Worsening" };
  }

  if (score >= 65) {
    return { label: "Weak", tone: "#c2410c", track: "rgba(194, 65, 12, 0.2)", direction: "Needs review" };
  }

  if (score >= 31) {
    return { label: "Good", tone: "#3b82f6", track: "rgba(59, 130, 246, 0.18)", direction: "Watch" };
  }

  return { label: "Strong", tone: "#34d399", track: "rgba(52, 211, 153, 0.18)", direction: "Healthy" };
}

export function RiskGauge({ score, size = "sm", showDetails = true }: { score: number; size?: RiskGaugeSize; showDetails?: boolean }) {
  const normalized = Math.max(0, Math.min(100, score));
  const band = getRiskBand(normalized);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (normalized / 100) * circumference;
  const dimensions = size === "lg" ? "h-44 w-44" : size === "md" ? "h-36 w-36" : "h-28 w-28";
  const scoreSize = size === "lg" ? "text-5xl" : size === "md" ? "text-4xl" : "text-2xl";

  return (
    <div className="flex items-center gap-5">
      <div className={`relative ${dimensions}`}>
        <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
          <circle cx="56" cy="56" r={radius} fill="none" stroke={band.track} strokeWidth="10" />
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={band.tone}
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            strokeWidth="10"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className={`${scoreSize} font-black text-white`}>{normalized}</p>
            <p className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: band.tone }}>
              {band.label}
            </p>
          </div>
        </div>
      </div>
      {showDetails ? <div className="min-w-0">
        <p className="text-sm font-bold text-muted">Risk direction</p>
        <p className="mt-1 text-lg font-black text-white">{band.direction}</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {band.label === "Strong"
            ? "Low exposure. Keep monitoring ownership and access drift."
            : band.label === "Good"
              ? "Balanced posture. Continue watching access and policy coverage."
              : band.label === "Weak"
                ? "Weakening posture. Prioritize owner, access, and control review."
                : "High exposure. Quarantine or approve only with strong evidence."}
        </p>
      </div> : null}
    </div>
  );
}
