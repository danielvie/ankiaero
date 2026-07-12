import { useEffect, useState } from "react";
import { formatDueTime } from "../scheduler";
import type { Card, CardProgress } from "../types";

const maxBrowseCards = 200;

type BrowseProps = {
  cards: Card[];
  progress: Record<string, CardProgress>;
  markedCardIds: Set<string>;
  cardNotes: Record<string, string>;
  showMarkedOnly: boolean;
  setShowMarkedOnly: (value: boolean) => void;
  showNotedOnly: boolean;
  setShowNotedOnly: (value: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  reviewCard: (card: Card) => void;
  resetCard: (cardId: string) => void;
  resetCards: (cardIds: string[]) => void;
  saveNote: (cardId: string, note: string) => void;
  toggleMarked: (cardId: string) => void;
};

export function Browse({ cards, progress, markedCardIds, cardNotes, showMarkedOnly, setShowMarkedOnly, showNotedOnly, setShowNotedOnly, query, setQuery, reviewCard, resetCard, resetCards, saveNote, toggleMarked }: BrowseProps) {
  const visibleCards = cards.slice(0, maxBrowseCards);
  const [noteCard, setNoteCard] = useState<Card | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => setConfirmReset(false), [query, showMarkedOnly, showNotedOnly, visibleCards.length]);

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

  return (
    <div>
      <header className="border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-[18px] pb-3 pt-5">
        <h1 className="text-xs font-bold tracking-[0.16em] text-cockpit-accent">BUSCA</h1>
        <small className="mt-1 block text-[9px] tracking-[0.06em] text-cockpit-dim">{cards.length} CARDS · ATÉ {maxBrowseCards} EXIBIDOS</small>
      </header>

      <div className="relative mx-4 mb-1 mt-3">
        <span className="pointer-events-none absolute left-3 top-2.5 text-cockpit-muted">⌕</span>
        <input className="w-full rounded-md border border-cockpit-line bg-cockpit-panel py-2.5 pl-8 pr-9 text-[11px] text-cockpit-text placeholder:text-cockpit-muted" placeholder="BUSCAR ENUNCIADO / NOTA…" value={query} onChange={(event) => setQuery(event.target.value)} />
        {query && <button aria-label="Limpar Busca" className="absolute right-3 top-2.5 text-cockpit-muted transition hover:text-cockpit-bright" onClick={() => setQuery("")} type="button">×</button>}
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-2 text-[9px] tracking-[0.06em]">
        <button className={filterClass(showMarkedOnly)} onClick={() => setShowMarkedOnly(!showMarkedOnly)} type="button">★ MARCADOS ({markedCardIds.size})</button>
        <button className={filterClass(showNotedOnly)} onClick={() => setShowNotedOnly(!showNotedOnly)} type="button">N NOTAS</button>
        <button className="ml-auto rounded border border-cockpit-line px-2 py-1.5 text-cockpit-muted transition hover:border-cockpit-muted hover:text-cockpit-soft disabled:opacity-40" disabled={!visibleCards.length} onClick={() => confirmReset ? (resetCards(visibleCards.map((card) => card.id)), setConfirmReset(false)) : setConfirmReset(true)} type="button">
          {confirmReset ? "CONFIRMAR REINÍCIO" : "REINICIAR VISÍVEIS"}
        </button>
      </div>

      <div className="grid gap-2 px-4 pb-5 pt-1">
        {visibleCards.map((card) => {
          const hasNote = Boolean(cardNotes[card.id]?.trim());
          const isMarked = markedCardIds.has(card.id);
          return (
            <article className="rounded-md border border-cockpit-line bg-cockpit-panel px-3 py-2.5" key={card.id}>
              <div className="flex justify-between gap-2 text-[9px] tracking-[0.1em] text-cockpit-muted">
                <b className="text-cockpit-accent">{shortCardId(card)}</b>
                <span>{dueLabel(progress[card.id].dueAt)}</span>
              </div>
              <p className="mt-1.5 line-clamp-3 text-[10px] leading-relaxed tracking-[0.02em] text-cockpit-text">{card.question}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex gap-2 text-[9px] text-cockpit-soft">
                  <button aria-label={isMarked ? "Desmarcar Card" : "Marcar Card"} className="transition hover:text-cockpit-accent" onClick={() => toggleMarked(card.id)} type="button">[{isMarked ? "★ MARCADO" : "☆"}]</button>
                  <button aria-label={hasNote ? "Abrir Nota" : "Adicionar Nota"} className="transition hover:text-cockpit-accent" onClick={() => openNote(card)} type="button">[{hasNote ? "N NOTA" : "+ NOTA"}]</button>
                </div>
                <div className="flex gap-1.5">
                  <button className="rounded border border-cockpit-line px-2 py-1 text-[8px] tracking-[0.08em] text-cockpit-muted transition hover:border-cockpit-muted hover:text-cockpit-soft" onClick={() => resetCard(card.id)} type="button">REINICIAR</button>
                  <button className="rounded border border-cockpit-accent/40 px-2 py-1 text-[8px] tracking-[0.1em] text-cockpit-accent hover:border-cockpit-accent hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={() => reviewCard(card)} type="button">REVISAR</button>
                </div>
              </div>
            </article>
          );
        })}
        {!visibleCards.length && <p className="py-8 text-center text-[10px] tracking-[0.08em] text-cockpit-muted">NENHUM CARD ENCONTRADO</p>}
      </div>

      {noteCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cockpit-deep/90 p-4">
          <div className="w-full max-w-lg rounded-md border border-cockpit-line bg-cockpit-ink p-4">
            <div className="flex justify-between text-[10px] tracking-[0.1em] text-cockpit-accent"><span>NOTA — {shortCardId(noteCard)}</span><button className="transition hover:text-cockpit-bright" onClick={closeNote} type="button">×</button></div>
            <p className="mt-3 line-clamp-3 text-[10px] leading-relaxed text-cockpit-muted">{noteCard.question}</p>
            <textarea className="mt-3 h-36 w-full resize-none rounded-md border border-cockpit-line bg-cockpit-panel p-3 text-[11px] leading-relaxed text-cockpit-text" placeholder="ADICIONAR NOTA…" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} />
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded border border-cockpit-accent py-2.5 text-[9px] tracking-[0.1em] text-cockpit-accent hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={submitNote} type="button">SALVAR</button>
              <button className="rounded border border-cockpit-red/40 px-4 py-2.5 text-[9px] text-cockpit-red transition hover:bg-cockpit-red/10" onClick={() => { saveNote(noteCard.id, ""); closeNote(); }} type="button">APAGAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function filterClass(active: boolean) {
  return `rounded border px-2 py-1.5 transition ${active ? "border-cockpit-accent bg-cockpit-accentBg text-cockpit-accent hover:brightness-125" : "border-cockpit-line text-cockpit-muted hover:border-cockpit-muted hover:text-cockpit-soft"}`;
}

function shortCardId(card: Card) {
  const index = card.id.match(/-(\d+)$/)?.[1] ?? "0";
  const prefix = card.subject.split(" ").map((word) => word[0]).join("").slice(0, 3);
  return `${prefix}-${index.padStart(4, "0")}`;
}

function dueLabel(dueAt: number) {
  const due = formatDueTime(dueAt).toUpperCase();
  return due === "AGORA" ? "DEVIDO AGORA" : `EM ${due}`;
}
