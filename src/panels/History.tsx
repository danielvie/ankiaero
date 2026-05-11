import { ArrowLeft } from "lucide-react";
import type { Card } from "../types";

export function History({ cards, onBack, reviewCard }: { cards: Card[]; onBack: () => void; reviewCard: (card: Card) => void }) {
  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-white/10 px-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white sm:px-3"
          onClick={onBack}
          type="button"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Voltar</span>
        </button>
        <h2 className="text-3xl font-semibold">Histórico</h2>
      </div>

      {cards.length === 0 ? (
        <p className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          Nenhum card visto ainda.
        </p>
      ) : (
        <div className="max-h-[68vh] space-y-3 overflow-auto pr-1">
          {cards.map((card) => (
            <div key={card.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <p className="font-mono text-xs text-cockpit-amber">{card.subject}</p>
                  <p className="mt-1 text-sm text-slate-100">{card.question}</p>
                </div>
                <button
                  className="rounded bg-cockpit-glow px-3 py-2 text-sm font-semibold text-cockpit-ink"
                  onClick={() => reviewCard(card)}
                  type="button"
                >
                  Estudar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
