import { getSubjectRows } from "../studyStats";
import { appBuiltAt, appVersion } from "../version";
import type { SubjectFilter } from "../appTypes";
import type { CardProgress } from "../types";

export function Dashboard({ progress, startReview }: { progress: Record<string, CardProgress>; startReview: (subject?: SubjectFilter) => void }) {
  const rows = getSubjectRows(progress);
  const due = rows.reduce((total, row) => total + row.due, 0);

  return (
    <div>
      <header className="flex items-baseline justify-between border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-5 pb-3 pt-5">
        <h1 className="text-sm font-bold tracking-[0.18em] text-cockpit-accent">ANKI AERO</h1>
        <span className="text-[10px] text-cockpit-dim">v{appVersion} · OFFLINE</span>
      </header>

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
        <button className="w-full rounded-md border border-cockpit-accent bg-cockpit-accentBg px-3 py-3 text-[11px] tracking-[0.1em] text-cockpit-accent hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={() => startReview("ALL")} type="button">
          ▶ INICIAR REVISÃO — {due} DEVIDOS
        </button>
      </div>

      <div className="grid gap-2 px-4 pb-5">
        {rows.map((row) => (
          <div className="flex items-center justify-between rounded-md border border-cockpit-line bg-cockpit-panel px-3 py-3" key={row.subject}>
            <span className="text-[10px] tracking-[0.05em] text-cockpit-soft">{row.subject} · {row.accuracy}%</span>
            <button className="rounded border border-cockpit-accent/40 px-2 py-1 text-[9px] tracking-[0.1em] text-cockpit-accent hover:border-cockpit-accent hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink disabled:opacity-40" disabled={row.due === 0} onClick={() => startReview(row.subject)} type="button">
              REVISAR {row.due}
            </button>
          </div>
        ))}
      </div>
      <p className="px-4 pb-4 text-center text-[8px] tracking-[0.08em] text-cockpit-dim">BUILD {appBuiltAt}</p>
    </div>
  );
}

function shortSubject(subject: string) {
  if (subject === "CONHECIMENTOS TÉCNICOS") return "CONH. TÉCNICOS";
  return subject;
}
