import { DEFAULT_PACKAGE_SESSIONS } from "@/lib/constants";
import { formatSessionBlocks } from "@/lib/session-package";

type SessionProgressProps = {
  usedSessions: number;
  totalSessions?: number;
  size?: "sm" | "md" | "lg";
};

export function SessionProgress({
  usedSessions,
  totalSessions = DEFAULT_PACKAGE_SESSIONS,
  size = "md",
}: SessionProgressProps) {
  const used = Math.min(Math.max(usedSessions, 0), totalSessions);
  const blocks = formatSessionBlocks(used, totalSessions);

  const sizeClass =
    size === "lg"
      ? "text-2xl tracking-[0.2em]"
      : size === "sm"
        ? "text-sm tracking-[0.12em]"
        : "text-lg tracking-[0.16em]";

  return (
    <div
      className="inline-flex items-baseline gap-3"
      aria-label={`수업 진행 ${used} / ${totalSessions}`}
    >
      <span
        className={`font-mono font-semibold text-[var(--ink)] ${sizeClass}`}
      >
        {blocks}
      </span>
      <span className="text-[var(--muted)] tabular-nums">
        <span className="font-semibold text-[var(--ink)]">{used}</span>
        {" / "}
        {totalSessions}
      </span>
    </div>
  );
}
