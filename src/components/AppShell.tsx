import type { View } from "../appTypes";

const softKeys: { label: string; view: View }[] = [
  { label: "PAINEL", view: "dashboard" },
  { label: "REVISÃO", view: "review" },
  { label: "BUSCA", view: "browse" },
  { label: "HISTÓRICO", view: "history" },
  { label: "DADOS", view: "settings" }
];

export function AppShell({
  view,
  onViewChange,
  children
}: {
  view: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent pb-20 font-sans text-cockpit-text">
      <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-3xl">{children}</main>
      <nav
        aria-label="Painéis"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-cockpit-line bg-cockpit-deep/95 px-2 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1.5">
          {softKeys.map((key) => (
            <button
              key={key.view}
              aria-current={view === key.view ? "page" : undefined}
              className={`min-w-0 rounded border px-0.5 py-2.5 text-[9px] tracking-[0.07em] transition sm:text-xs ${view === key.view ? "border-cockpit-accent bg-cockpit-accentBg text-cockpit-accent" : "border-cockpit-line bg-cockpit-panel text-cockpit-muted hover:border-cockpit-muted hover:bg-cockpit-line/40 hover:text-cockpit-soft"}`}
              onClick={() => onViewChange(key.view)}
              type="button"
            >
              {key.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
