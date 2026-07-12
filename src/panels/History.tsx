import type { Card, CardProgress, Grade } from "../types";

const gradeLabels: Record<Grade, string> = { again: "LAPSO", hard: "DIFÍCIL", good: "BOM", easy: "FÁCIL" };

export function History({ cards, progress, reviewCard }: { cards: Card[]; progress: Record<string, CardProgress>; reviewCard: (card: Card) => void }) {
  return (
    <div>
      <header className="border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-[18px] pb-3 pt-5">
        <h1 className="text-xs font-bold tracking-[0.16em] text-cockpit-accent">HISTÓRICO</h1>
        <small className="mt-1 block text-[9px] tracking-[0.06em] text-cockpit-dim">REVISÕES RECENTES · HORÁRIO LOCAL</small>
      </header>
      <div className="grid gap-2 px-4 pb-5 pt-3">
        {cards.map((card) => {
          const cardProgress = progress[card.id];
          return (
            <article className="rounded-md border border-cockpit-line bg-cockpit-panel px-3 py-2.5" key={card.id}>
              <div className="flex items-baseline justify-between gap-2 text-[9px] tracking-[0.1em]">
                <b className="truncate text-cockpit-accent">{card.subject}</b>
                <span className="shrink-0 text-cockpit-dim">{formatTime(cardProgress.lastAnsweredAt)}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-cockpit-text">{card.question}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <ResultChip lastGrade={cardProgress.lastGrade} />
                <button className="rounded border border-cockpit-accent px-2 py-1 text-[8px] tracking-[0.1em] text-cockpit-text hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={() => reviewCard(card)} type="button">REVISAR</button>
              </div>
            </article>
          );
        })}
        {!cards.length && <p className="py-10 text-center text-[10px] tracking-[0.08em] text-cockpit-muted">NENHUM CARD REVISADO</p>}
      </div>
    </div>
  );
}

function ResultChip({ lastGrade }: { lastGrade?: Grade }) {
  const tone = lastGrade === "again"
    ? "border-cockpit-red/40 bg-cockpit-red/10 text-cockpit-red"
    : lastGrade
      ? "border-cockpit-green/40 bg-cockpit-green/10 text-cockpit-green"
      : "border-cockpit-line bg-cockpit-ink/50 text-cockpit-muted";
  return <b className={`rounded border px-1.5 py-0.5 text-[8px] tracking-[0.08em] ${tone}`}>{lastGrade ? gradeLabels[lastGrade] : "VISTO"}</b>;
}

function formatTime(timestamp?: number) {
  if (!timestamp) return "--:--";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(timestamp);
}
