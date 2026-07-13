import { PlayCircle } from "lucide-react";
import { getSubjectRows } from "../studyStats";
import { appBuiltAt, appVersion } from "../version";
import type { SubjectFilter } from "../appTypes";
import type { CardProgress } from "../types";

export function Dashboard({ progress, startReview }: { progress: Record<string, CardProgress>; startReview: (subject?: SubjectFilter) => void }) {
  const rows = getSubjectRows(progress);
  const due = rows.reduce((total, row) => total + row.due, 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-4 px-3 pb-2 pt-5">
        {rows.map((row) => (
          <div className="text-center" key={row.subject}>
            <div
              className="relative mx-auto grid size-[76px] place-items-center rounded-full border border-cockpit-line"
              style={{ background: `conic-gradient(#f6b44b ${row.accuracy}%, #334155 0)` }}
            >
              <div className="absolute inset-[5px] rounded-full bg-cockpit-ink" />
              <div className="relative">
                <b className={`block text-base ${row.accuracy < 60 && row.reviewed > 0 ? "text-cockpit-accent" : "text-cockpit-bright"}`}>{row.accuracy}%</b>
                <small className="block text-[8px] text-cockpit-muted">PRECISÃO</small>
              </div>
            </div>
            <span className="mt-2 block truncate text-[8px] tracking-[0.07em] text-cockpit-soft">{shortSubject(row.subject)}</span>
            <span className="mt-0.5 block text-[10px] text-cockpit-accent">{row.due} DEVIDOS</span>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-3 mt-4">
        <button className="w-full hover:cursor-pointer rounded-md border bg-accent-alt border-cockpit-accent px-3 py-3 text-[11px] tracking-[0.1em] text-cockpit-ink hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={() => startReview("ALL")} type="button">
          ▶ INICIAR REVISÃO — {due} DEVIDOS
        </button>
      </div>

      <div className="grid gap-3 px-4 pb-5">
        {rows.map((row) => (
          <div className="rounded-md border border-cockpit-line bg-cockpit-panel p-4" key={row.subject}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="font-semibold text-cockpit-bright">{row.subject}</div>
                <div className="mt-1 font-mono text-sm text-cockpit-soft">
                  {row.due} devidos / {row.total} · {row.accuracy}% acerto
                </div>
              </div>
              <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-cockpit-accent px-3 py-2 text-sm font-semibold text-cockpit-accent hover:bg-cockpit-accent hover:text-cockpit-ink disabled:opacity-40" disabled={row.due === 0} onClick={() => startReview(row.subject)} type="button">
                <PlayCircle className="size-4" aria-hidden="true" />
                Revisar
              </button>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-cockpit-ink">
              <div className="h-full bg-cockpit-accent" style={{ width: `${Math.round((row.reviewed / row.total) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="px-4 pb-4 text-center text-[8px] tracking-[0.08em] text-cockpit-dim">APP V{appVersion} · BUILD {appBuiltAt}</p>
    </div>
  );
}

function shortSubject(subject: string) {
  if (subject === "CONHECIMENTOS TÉCNICOS") return "CONH. TÉCNICOS";
  return subject;
}
