type RiskGaugeSize = "sm" | "lg";

function getRiskBand(score: number) {
  if (score >= 81) {
    return { label: "Critical", tone: "#fb7185", track: "rgba(251, 113, 133, 0.18)", direction: "Worsening" };
  }

  if (score >= 61) {
    return { label: "Elevated", tone: "#f97316", track: "rgba(249, 115, 22, 0.18)", direction: "Needs review" };
  }

  if (score >= 31) {
    return { label: "Moderate", tone: "#fbbf24", track: "rgba(251, 191, 36, 0.18)", direction: "Watch" };
  }

  return { label: "Good", tone: "#34d399", track: "rgba(52, 211, 153, 0.18)", direction: "Healthy" };
}

export function RiskGauge({ score, size = "sm" }: { score: number; size?: RiskGaugeSize }) {
  const normalized = Math.max(0, Math.min(100, score));
  const band = getRiskBand(normalized);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (normalized / 100) * circumference;
  const dimensions = size === "lg" ? "h-40 w-40" : "h-28 w-28";
  const scoreSize = size === "lg" ? "text-4xl" : "text-2xl";

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
      <div className="min-w-0">
        <p className="text-sm font-bold text-muted">Risk direction</p>
        <p className="mt-1 text-lg font-black text-white">{band.direction}</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {band.label === "Good"
            ? "Low exposure. Keep monitoring ownership and access drift."
            : band.label === "Moderate"
              ? "Some exposure exists. Review access and policy coverage."
              : band.label === "Elevated"
                ? "Weakening posture. Prioritize owner, access, and control review."
                : "High exposure. Quarantine or approve only with strong evidence."}
        </p>
      </div>
    </div>
  );
}
