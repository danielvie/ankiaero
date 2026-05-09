import { Search, Star } from "lucide-react";
import { formatDueTime } from "../scheduler";
import type { Card, CardProgress } from "../types";

const maxBrowseCards = 200;

export function Browse({
  cards,
  progress,
  markedCardIds,
  showMarkedOnly,
  setShowMarkedOnly,
  query,
  setQuery,
  reviewCard,
  resetCard,
  toggleMarked
}: {
  cards: Card[];
  progress: Record<string, CardProgress>;
  markedCardIds: Set<string>;
  showMarkedOnly: boolean;
  setShowMarkedOnly: (showMarkedOnly: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  reviewCard: (card: Card) => void;
  resetCard: (cardId: string) => void;
  toggleMarked: (cardId: string) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <h2 className="mb-4 text-3xl font-semibold">Browse</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} />
          <input
            className="w-full rounded-md border border-cockpit-line bg-cockpit-ink py-3 pl-10 pr-3 text-white"
            placeholder="Buscar pergunta ou alternativa"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button
          className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold ${
            showMarkedOnly ? "border-cockpit-amber bg-cockpit-amber/15 text-cockpit-amber" : "border-white/10 text-slate-200 hover:bg-white/10"
          }`}
          onClick={() => setShowMarkedOnly(!showMarkedOnly)}
          type="button"
        >
          <Star size={17} fill={showMarkedOnly ? "currentColor" : "none"} />
          Marcadas ({markedCardIds.size})
        </button>
      </div>
      <div className="mt-4 max-h-[68vh] space-y-3 overflow-auto pr-1">
        {cards.slice(0, maxBrowseCards).map((card) => (
          <div key={card.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="font-mono text-xs text-cockpit-amber">{card.subject}</p>
                <p className="mt-1 text-sm text-slate-100">{card.question}</p>
                <p className="mt-2 text-xs text-slate-400">Próxima: {formatDueTime(progress[card.id].dueAt)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={`rounded border px-3 py-2 text-sm ${
                    markedCardIds.has(card.id) ? "border-cockpit-amber text-cockpit-amber" : "border-white/10 text-slate-200"
                  }`}
                  onClick={() => toggleMarked(card.id)}
                  type="button"
                >
                  <Star size={16} fill={markedCardIds.has(card.id) ? "currentColor" : "none"} />
                </button>
                <button className="rounded bg-cockpit-glow px-3 py-2 text-sm font-semibold text-cockpit-ink" onClick={() => reviewCard(card)} type="button">
                  Estudar
                </button>
                <button className="rounded border border-white/10 px-3 py-2 text-sm text-slate-200" onClick={() => resetCard(card.id)} type="button">
                  Resetar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
