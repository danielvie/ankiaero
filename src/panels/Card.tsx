import { Pencil, Star } from "lucide-react";
import { useState } from "react";
import { previewSchedule } from "../scheduler";
import type { Card as StudyCard, CardProgress, Grade } from "../types";

const gradeLabels: Record<Grade, string> = {
  again: "NOVAMENTE",
  hard: "DIFÍCIL",
  good: "BOM",
  easy: "FÁCIL"
};

export function Card({
  card,
  progress,
  dueCount,
  isMarked,
  note,
  selectedAnswer,
  revealed,
  onBack,
  chooseAnswer,
  gradeAnswer,
  saveNote,
  toggleMarked
}: {
  card: StudyCard;
  progress: CardProgress;
  dueCount: number;
  isMarked: boolean;
  note: string;
  selectedAnswer: string | null;
  revealed: boolean;
  onBack: () => void;
  chooseAnswer: (answer: string) => void;
  gradeAnswer: (grade: Grade) => void;
  saveNote: (note: string) => void;
  toggleMarked: () => void;
}) {
  const correct = selectedAnswer === card.answer;
  const [noteDraft, setNoteDraft] = useState(note);
  const [notesOpen, setNotesOpen] = useState(false);
  const now = Date.now();

  const openNotes = () => {
    setNoteDraft(note);
    setNotesOpen(true);
  };

  const saveAndClose = () => {
    saveNote(noteDraft);
    setNotesOpen(false);
  };

  const deleteAndClose = () => {
    saveNote("");
    setNoteDraft("");
    setNotesOpen(false);
  };

  if (notesOpen) {
    return (
      <div className="min-h-[calc(100vh-5rem)]">
        <header className="flex items-center justify-between border-b-2 border-cockpit-glow/40 bg-cockpit-panel/95 px-4 py-[18px] text-[10px] tracking-[0.1em] text-cockpit-soft">
          <button className="text-cockpit-primary" onClick={() => setNotesOpen(false)} type="button">◀ CARD</button>
          <span>NOTA — {shortCardId(card)}</span>
        </header>
        <p className="px-[18px] pb-1 pt-4 text-[10px] leading-relaxed tracking-[0.04em] text-cockpit-muted">{card.question}</p>
        <div className="px-4 py-2">
          <textarea className="h-40 w-full resize-none rounded-md border border-cockpit-border bg-cockpit-panel p-3 text-[11px] leading-relaxed text-cockpit-text outline-none focus:border-cockpit-primary" placeholder="ADICIONAR NOTA…" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} />
        </div>
        <div className="flex gap-2 px-4 pb-5 pt-2">
          <button className="flex-1 rounded-md border border-cockpit-active px-2 py-3 text-[10px] tracking-[0.1em] text-cockpit-primary" onClick={saveAndClose} type="button">✔ SALVAR NOTA</button>
          <button className="basis-1/3 rounded-md border border-cockpit-red/40 px-2 py-3 text-[10px] tracking-[0.1em] text-cockpit-red disabled:opacity-40" disabled={!note.trim() && !noteDraft.trim()} onClick={deleteAndClose} type="button">✕ APAGAR</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col">
      <header className="border-b-2 border-cockpit-glow/40 bg-cockpit-panel/95 px-4 py-3 text-[10px] tracking-[0.08em] text-cockpit-soft">
        <div className="flex items-center justify-between gap-3">
          <button className="shrink-0 text-cockpit-primary" onClick={onBack} type="button">◀ PAINEL</button>
          <span className="truncate text-right">{card.subject} · {dueCount} DEVIDOS</span>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-cockpit-line pt-3">
          <button
            aria-label={isMarked ? "Desmarcar Card" : "Marcar Card"}
            className={`flex h-9 items-center gap-1.5 rounded border px-2.5 ${isMarked ? "border-cockpit-amber/60 bg-cockpit-amber/10 text-cockpit-amber" : "border-cockpit-border text-cockpit-soft"}`}
            onClick={toggleMarked}
            type="button"
          >
            <Star size={14} fill={isMarked ? "currentColor" : "none"} />
            <span>MARCAR</span>
          </button>
          <button className={`flex h-9 items-center gap-1.5 rounded border px-2.5 ${note.trim() ? "border-cockpit-glow/60 bg-cockpit-activeBg text-cockpit-primary" : "border-cockpit-border text-cockpit-soft"}`} onClick={openNotes} type="button">
            <Pencil size={14} />
            <span>NOTA</span>
          </button>
          <div className="ml-auto rounded border border-cockpit-border bg-cockpit-ink/70 px-2 py-2 text-right text-[9px] leading-tight text-cockpit-muted">
            <span className="block">{progress.attempts} {progress.attempts === 1 ? "TENTATIVA" : "TENTATIVAS"}</span>
            <span className="mt-0.5 block">INTERVALO {formatInterval(progress.intervalDays)}</span>
          </div>
        </div>
      </header>

      <h2 className="px-5 py-6 text-sm leading-relaxed text-cockpit-bright">{card.question}</h2>
      <div className="grid gap-2 px-4">
        {card.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isAnswer = card.answer === option;
          const state = revealed && isAnswer
            ? "border-cockpit-green bg-cockpit-green/10 text-cockpit-green"
            : revealed && isSelected
              ? "border-cockpit-red bg-cockpit-red/10 text-cockpit-red"
              : "border-cockpit-border bg-cockpit-panel text-cockpit-text hover:border-cockpit-primary";
          return (
            <button className={`rounded-md border px-3 py-3 text-left text-[12px] leading-relaxed transition ${state}`} disabled={revealed} key={option} onClick={() => chooseAnswer(option)} type="button">
              {option}
            </button>
          );
        })}
      </div>

      {revealed && correct && (
        <div className="mt-auto grid grid-cols-4 gap-1.5 px-4 pb-5 pt-5">
          {(Object.keys(gradeLabels) as Grade[]).map((grade) => (
            <button className="grid gap-1 rounded-md border border-cockpit-border px-0.5 py-3 text-[9px] tracking-[0.04em] text-cockpit-primary" key={grade} onClick={() => gradeAnswer(grade)} type="button">
              <span>{gradeLabels[grade]}</span>
              <small className="text-[8px] text-cockpit-muted">{previewSchedule(progress, grade, true, now).toUpperCase()}</small>
            </button>
          ))}
        </div>
      )}
      {revealed && !correct && (
        <div className="mt-auto px-4 pb-5 pt-5">
          <button className="w-full rounded-md border border-cockpit-border px-3 py-3 text-[11px] tracking-[0.12em] text-cockpit-text" onClick={() => gradeAnswer("again")} type="button">OK — PRÓXIMO CARD</button>
        </div>
      )}
    </div>
  );
}

function shortCardId(card: StudyCard) {
  const index = card.id.match(/-(\d+)$/)?.[1] ?? "0";
  const prefix = card.subject.split(" ").map((word) => word[0]).join("").slice(0, 3);
  return `${prefix}-${index.padStart(4, "0")}`;
}

function formatInterval(intervalDays: number) {
  if (intervalDays === 0) return "0D";
  if (intervalDays < 1) return `${Math.round(intervalDays * 24)}H`;
  return `${intervalDays}D`;
}
