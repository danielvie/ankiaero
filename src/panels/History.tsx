import type { Card, CardProgress, Grade } from "../types";

const gradeLabels: Record<Grade, string> = { again: "LAPSO", hard: "DIFÍCIL", good: "BOM", easy: "FÁCIL" };

export function History({ cards, progress, reviewCard }: { cards: Card[]; progress: Record<string, CardProgress>; reviewCard: (card: Card) => void }) {
  return (
    <div>
      <header className="border-b-2 border-cockpit-glow/40 bg-cockpit-panel/95 px-[18px] pb-3 pt-5">
        <h1 className="text-xs font-bold tracking-[0.16em] text-cockpit-primary">HISTÓRICO</h1>
        <small className="mt-1 block text-[9px] tracking-[0.06em] text-cockpit-dim">REVISÕES RECENTES · HORÁRIO LOCAL</small>
      </header>
      <div className="grid px-4 pb-5 pt-3">
        {cards.map((card) => {
          const cardProgress = progress[card.id];
          const result = cardProgress.lastGrade ? gradeLabels[cardProgress.lastGrade] : "VISTO";
          return (
            <button className="flex gap-2.5 border-b border-dashed border-cockpit-line px-1 py-3 text-left text-[10px] leading-relaxed" key={card.id} onClick={() => reviewCard(card)} type="button">
              <span className="shrink-0 text-cockpit-dim">{formatTime(cardProgress.lastAnsweredAt)}</span>
              <span className="line-clamp-2 flex-1 text-cockpit-soft">{subjectCode(card.subject)} — {card.question}</span>
              <b className={`shrink-0 ${cardProgress.lastGrade === "again" ? "text-cockpit-amber" : cardProgress.lastGrade ? "text-cockpit-green" : "text-cockpit-muted"}`}>{result}</b>
            </button>
          );
        })}
        {!cards.length && <p className="py-10 text-center text-[10px] tracking-[0.08em] text-cockpit-muted">NENHUM CARD REVISADO</p>}
      </div>
    </div>
  );
}

function formatTime(timestamp?: number) {
  if (!timestamp) return "--:--";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(timestamp);
}

function subjectCode(subject: string) {
  return subject.split(" ").map((word) => word[0]).join("").slice(0, 3);
}
