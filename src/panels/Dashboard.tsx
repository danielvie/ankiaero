import { PlayCircle } from "lucide-react";
import { getSubjectRows } from "../studyStats";
import { appBuiltAt, appVersion } from "../version";
import type { SubjectFilter } from "../appTypes";
import type { CardProgress } from "../types";

export function Dashboard({
  progress,
  startReview
}: {
  progress: Record<string, CardProgress>;
  startReview: (subject?: SubjectFilter) => void;
}) {
  const rows = getSubjectRows(progress);

  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cockpit-amber">repetição espaçada</p>
          <h2 className="mt-2 text-3xl font-semibold">Dashboard</h2>
        </div>
        <button className="rounded-md bg-cockpit-amber px-4 py-3 font-semibold text-cockpit-ink hover:brightness-110" onClick={() => startReview()} type="button">
          Revisar agora
        </button>
      </div>
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <div key={row.subject} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="font-semibold">{row.subject}</div>
                <div className="mt-1 font-mono text-sm text-slate-300">
                  {row.due} pendentes / {row.total}
                </div>
              </div>
              <button
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-cockpit-amber/60 px-3 py-2 text-sm font-semibold text-cockpit-amber hover:bg-cockpit-amber hover:text-cockpit-ink"
                onClick={() => startReview(row.subject)}
                type="button"
              >
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                Revisar
              </button>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-cockpit-ink">
              <div className="h-full bg-cockpit-glow" style={{ width: `${Math.round((row.reviewed / row.total) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-xs text-slate-300">
        App v{appVersion} · build {appBuiltAt}
      </div>
    </div>
  );
}
