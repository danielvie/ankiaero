import { Star } from "lucide-react";
import { subjects } from "../cards";
import type { SubjectFilter } from "../appTypes";
import type { StudyStats } from "../studyStats";

export function Stats({
  subject,
  onSubjectChange,
  stats,
  markedCount,
  onOpenMarked
}: {
  subject: SubjectFilter;
  onSubjectChange: (subject: SubjectFilter) => void;
  stats: StudyStats;
  markedCount: number;
  onOpenMarked: () => void;
}) {
  return (
    <aside className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-4 shadow-2xl shadow-black/20">
      <h2 className="text-lg font-semibold text-white">STATS</h2>
      <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Matéria</label>
      <select
        className="mt-2 w-full rounded-md border border-cockpit-line bg-cockpit-ink px-3 py-2 text-sm text-white"
        value={subject}
        onChange={(event) => onSubjectChange(event.target.value as SubjectFilter)}
      >
        <option value="ALL">Todas</option>
        {subjects.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Stat label="Due" value={stats.due} tone="text-cockpit-amber" />
        <Stat label="Total" value={stats.total} tone="text-cockpit-glow" />
        <Stat label="Done" value={stats.reviewed} tone="text-cockpit-green" />
        <Stat label="Hit" value={`${stats.accuracy}%`} tone="text-white" />
      </div>
      <button
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-cockpit-amber/50 bg-cockpit-amber/10 px-3 py-3 text-sm font-semibold text-cockpit-amber hover:bg-cockpit-amber/15"
        onClick={onOpenMarked}
        type="button"
      >
        <Star size={17} fill={markedCount > 0 ? "currentColor" : "none"} /> ({markedCount})
      </button>
    </aside>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
