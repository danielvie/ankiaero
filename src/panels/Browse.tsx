import { ArrowLeft, MessageSquareText, Search, Star, X } from "lucide-react";
import { useState } from "react";
import { formatDueTime } from "../scheduler";
import type { Card, CardProgress } from "../types";

const maxBrowseCards = 200;

export function Browse({
  cards,
  progress,
  markedCardIds,
  cardNotes,
  showMarkedOnly,
  setShowMarkedOnly,
  query,
  setQuery,
  onBack,
  reviewCard,
  resetCard,
  resetCards,
  saveNote,
  toggleMarked
}: {
  cards: Card[];
  progress: Record<string, CardProgress>;
  markedCardIds: Set<string>;
  cardNotes: Record<string, string>;
  showMarkedOnly: boolean;
  setShowMarkedOnly: (showMarkedOnly: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  onBack: () => void;
  reviewCard: (card: Card) => void;
  resetCard: (cardId: string) => void;
  resetCards: (cardIds: string[]) => void;
  saveNote: (cardId: string, note: string) => void;
  toggleMarked: (cardId: string) => void;
}) {
  const visibleCards = cards.slice(0, maxBrowseCards);
  const [noteCard, setNoteCard] = useState<Card | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const openNote = (card: Card) => {
    setNoteCard(card);
    setNoteDraft(cardNotes[card.id] ?? "");
  };

  const closeNote = () => {
    setNoteCard(null);
    setNoteDraft("");
  };

  const submitNote = () => {
    if (!noteCard) return;
    saveNote(noteCard.id, noteDraft);
    closeNote();
  };

  const deleteNote = () => {
    if (!noteCard) return;
    saveNote(noteCard.id, "");
    closeNote();
  };

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
        <h2 className="text-3xl font-semibold">Buscar</h2>
      </div>
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
        <button
          className="rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={visibleCards.length === 0}
          onClick={() => resetCards(visibleCards.map((card) => card.id))}
          type="button"
        >
          Resetar
        </button>
      </div>
      <div className="mt-4 max-h-[68vh] space-y-3 overflow-auto pr-1">
        {visibleCards.map((card) => {
          const hasNote = (cardNotes[card.id] ?? "").trim().length > 0;
          return (
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
                    aria-label="Marcar card"
                  >
                    <Star size={16} fill={markedCardIds.has(card.id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    className={`rounded border px-3 py-2 text-sm ${
                      hasNote ? "border-cockpit-glow text-cockpit-glow" : "border-white/10 text-slate-500"
                    }`}
                    onClick={() => openNote(card)}
                    type="button"
                    aria-label={hasNote ? "Abrir comentário" : "Adicionar comentário"}
                  >
                    <MessageSquareText size={16} fill={hasNote ? "currentColor" : "none"} />
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
          );
        })}
      </div>
      {noteCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-cockpit-panel p-5 shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-cockpit-glow">{noteCard.subject}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Comentário do card</h3>
              </div>
              <button
                className="rounded-md border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={closeNote}
                type="button"
                aria-label="Fechar comentário"
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              className="mt-4 min-h-40 w-full resize-y rounded-md border border-cockpit-line bg-cockpit-ink p-3 text-sm text-white outline-none focus:border-cockpit-glow"
              placeholder="Adicionar comentário"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap justify-between gap-2">
              <button
                className="rounded-md border border-cockpit-red/40 px-4 py-2 text-sm font-semibold text-cockpit-red hover:bg-cockpit-red/10 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!noteDraft.trim() && !(cardNotes[noteCard.id] ?? "").trim()}
                onClick={deleteNote}
                type="button"
              >
                Deletar
              </button>
              <div className="flex gap-2">
                <button className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10" onClick={closeNote} type="button">
                  Cancelar
                </button>
                <button className="rounded-md bg-cockpit-glow px-4 py-2 text-sm font-semibold text-cockpit-ink" onClick={submitNote} type="button">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
