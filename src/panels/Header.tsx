import { BarChart3, BookOpen, ClipboardCheck, History, Search, Settings } from "lucide-react";
import { Logo } from "../components/Logo";
import type { View } from "../appTypes";

export function Header({ view, onViewChange }: { view: View; onViewChange: (view: View) => void }) {
  return (
    <header className="border-b border-white/10 bg-cockpit-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 md:py-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <Logo className="size-12 shrink-0 sm:size-9" />
          <h1 className="min-w-0 truncate text-base font-semibold text-white sm:text-2xl">Anki Aero</h1>
        </div>
        <nav aria-label="Painéis" className="grid w-full shrink-0 grid-cols-6 gap-1 rounded-md border border-white/10 bg-white/5 p-1 sm:w-auto sm:gap-2">
          <NavButton active={view === "dashboard"} icon={<BarChart3 size={18} />} label="Painel" onClick={() => onViewChange("dashboard")} />
          <NavButton active={view === "review"} icon={<BookOpen size={18} />} label="Revisar" onClick={() => onViewChange("review")} />
          <NavButton active={view === "browse"} icon={<Search size={18} />} label="Buscar" onClick={() => onViewChange("browse")} />
          <NavButton active={view === "history"} icon={<History size={18} />} label="Histórico" onClick={() => onViewChange("history")} />
          <NavButton active={view === "simulation"} icon={<ClipboardCheck size={18} />} label="Simulado" onClick={() => onViewChange("simulation")} />
          <NavButton active={view === "settings"} icon={<Settings size={18} />} label="Dados" onClick={() => onViewChange("settings")} />
        </nav>
      </div>
    </header>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={`flex h-9 w-full items-center justify-center gap-2 rounded text-sm transition sm:w-9 lg:h-auto lg:w-auto lg:px-3 lg:py-2 ${
        active ? "bg-cockpit-accent text-cockpit-ink" : "text-cockpit-soft hover:bg-white/10 hover:text-white"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
