import { Search } from "lucide-react";
import { formatDueTime } from "../scheduler";
import type { Card, CardProgress } from "../types";

const maxBrowseCards = 200;

export function BrowseView({
  cards,
  progress,
  query,
  setQuery,
  reviewCard,
  resetCard
}: {
  cards: Card[];
  progress: Record<string, CardProgress>;
  query: string;
  setQuery: (query: string) => void;
  reviewCard: (card: Card) => void;
  resetCard: (cardId: string) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} />
        <input
          className="w-full rounded-md border border-cockpit-line bg-cockpit-ink py-3 pl-10 pr-3 text-white"
          placeholder="Buscar pergunta ou alternativa"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="mt-4 max-h-[68vh] space-y-3 overflow-auto pr-1">
        {cards.slice(0, maxBrowseCards).map((card) => (
          <div key={card.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="font-mono text-xs text-cockpit-amber">{card.subject}</p>
                <p className="mt-1 text-sm text-slate-100">{card.question}</p>
                <p className="mt-2 text-xs text-slate-400">Due: {formatDueTime(progress[card.id].dueAt)}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded bg-cockpit-glow px-3 py-2 text-sm font-semibold text-cockpit-ink" onClick={() => reviewCard(card)} type="button">
                  Study
                </button>
                <button className="rounded border border-white/10 px-3 py-2 text-sm text-slate-200" onClick={() => resetCard(card.id)} type="button">
                  Reset
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
