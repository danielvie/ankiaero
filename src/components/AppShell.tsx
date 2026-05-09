import { BarChart3, BookOpen, Search, Settings } from "lucide-react";
import { subjects } from "../cards";
import type { SubjectFilter, View } from "../appTypes";
import type { StudyStats } from "../studyStats";

type AppShellProps = {
  view: View;
  onViewChange: (view: View) => void;
  subject: SubjectFilter;
  onSubjectChange: (subject: SubjectFilter) => void;
  stats: StudyStats;
  children: React.ReactNode;
};

export function AppShell({ view, onViewChange, subject, onSubjectChange, stats, children }: AppShellProps) {
  const isReviewing = view === "review";

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-white/10 bg-cockpit-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-4 md:py-4">
          <div className="min-w-0">
            <p className="hidden font-mono text-xs uppercase tracking-[0.35em] text-cockpit-glow sm:block">ANAC deck</p>
            <h1 className="truncate text-base font-semibold text-white sm:text-2xl">Anki Aero</h1>
          </div>
          <nav className="grid shrink-0 grid-cols-4 gap-1 rounded-md border border-white/10 bg-white/5 p-1 sm:gap-2">
            <NavButton active={view === "dashboard"} icon={<BarChart3 size={18} />} label="Painel" onClick={() => onViewChange("dashboard")} />
            <NavButton active={view === "review"} icon={<BookOpen size={18} />} label="Revisar" onClick={() => onViewChange("review")} />
            <NavButton active={view === "browse"} icon={<Search size={18} />} label="Buscar" onClick={() => onViewChange("browse")} />
            <NavButton active={view === "settings"} icon={<Settings size={18} />} label="Dados" onClick={() => onViewChange("settings")} />
          </nav>
        </div>
      </header>

      <main className={`mx-auto grid max-w-7xl gap-5 px-4 py-5 ${isReviewing ? "" : "lg:grid-cols-[18rem_1fr]"}`}>
        {!isReviewing && (
          <aside className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-4 shadow-2xl shadow-black/20">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Matéria</label>
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
          </aside>
        )}

        <section>{children}</section>
      </main>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={`flex size-9 items-center justify-center gap-2 rounded text-sm transition sm:h-auto sm:w-auto sm:px-3 sm:py-2 ${
        active ? "bg-cockpit-glow text-cockpit-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
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
