import { ArrowLeft, CheckCircle2, Pencil, Star, X, XCircle } from "lucide-react";
import { useState } from "react";
import { formatDueTime, previewSchedule } from "../scheduler";
import type { Card, CardProgress, Grade } from "../types";

const gradeLabels: Record<Grade, string> = {
  again: "De novo",
  hard: "Difícil",
  good: "Bom",
  easy: "Fácil"
};

function optionLetter(option: string) {
  return option.match(/^[A-D]\)/)?.[0] ?? "";
}

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
  card: Card;
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
  const hasNote = note.trim().length > 0;

  const openNotes = () => {
    setNoteDraft(note);
    setNotesOpen(true);
  };

  const closeNotes = () => {
    setNoteDraft(note);
    setNotesOpen(false);
  };

  const submitNote = () => {
    saveNote(noteDraft);
    setNotesOpen(false);
  };

  const deleteNote = () => {
    saveNote("");
    setNoteDraft("");
    setNotesOpen(false);
  };

  return (
    <div className="answer-panel rounded-lg border border-white/10 p-5 shadow-2xl shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <button
            className="mt-1 flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-white/10 px-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white sm:px-3"
            onClick={onBack}
            type="button"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Voltar</span>
          </button>
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-cockpit-glow">{card.subject}</p>
            <p className="mt-1 text-sm text-slate-400">
              Próxima: {formatDueTime(progress.dueAt)} · Agora: {dueCount} {dueCount === 1 ? "item" : "itens"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
              isMarked ? "border-cockpit-amber bg-cockpit-amber/15 text-cockpit-amber" : "border-white/10 text-slate-300 hover:bg-white/10"
            }`}
            onClick={toggleMarked}
            type="button"
          >
            <Star size={17} fill={isMarked ? "currentColor" : "none"} />
          </button>
          <button
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
              hasNote ? "border-cockpit-glow bg-cockpit-glow/10 text-cockpit-glow" : "border-white/10 text-slate-300 hover:bg-white/10"
            }`}
            onClick={openNotes}
            type="button"
            aria-label="Notas"
          >
            <Pencil size={17} />
          </button>
          <div className="rounded-md border border-white/10 px-3 py-2 font-mono text-sm text-slate-300">
            {progress.attempts} tentativas · intervalo {progress.intervalDays}d
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-balance text-2xl font-semibold leading-snug text-white">{card.question}</h3>
      <div className="mt-6 grid gap-3">
        {card.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isAnswer = card.answer === option;
          const state = revealed && isAnswer ? "border-cockpit-green bg-cockpit-green/10" : revealed && isSelected ? "border-cockpit-red bg-cockpit-red/10" : "";
          return (
            <button
              key={option}
              className={`flex min-h-16 items-center gap-4 rounded-md border border-cockpit-line bg-cockpit-ink/80 p-4 text-left text-slate-100 transition hover:border-cockpit-glow ${state}`}
              disabled={revealed}
              onClick={() => chooseAnswer(option)}
              type="button"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded bg-white/10 font-mono text-sm text-cockpit-amber">
                {optionLetter(option)}
              </span>
              <span>{option.replace(/^[A-D]\)\s*/, "")}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 rounded-md border border-white/10 bg-cockpit-ink/80 p-4">
          <div className={`flex items-center gap-2 font-semibold ${correct ? "text-cockpit-green" : "text-cockpit-red"}`}>
            {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {correct ? "Correto" : "Incorreto"}
          </div>
          <p className="mt-2 text-slate-200">Resposta: {card.answer}</p>
          <div className={`mt-4 grid gap-2 ${correct ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"}`}>
            {(correct ? (Object.keys(gradeLabels) as Grade[]) : (["again"] as Grade[])).map((grade) => (
              <button
                key={grade}
                className="rounded-md border border-white/10 bg-white/10 px-3 py-3 text-white hover:bg-white/15"
                onClick={() => gradeAnswer(grade)}
                type="button"
              >
                <span className="block font-semibold">{correct ? gradeLabels[grade] : "OK"}</span>
                <span className="mt-1 block font-mono text-xs text-slate-300">
                  {previewSchedule(progress, grade, correct, now)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {notesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-cockpit-panel p-5 shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-cockpit-glow">{card.subject}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Notas do card</h3>
              </div>
              <button
                className="rounded-md border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={closeNotes}
                type="button"
                aria-label="Fechar notas"
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              className="mt-4 min-h-40 w-full resize-y rounded-md border border-cockpit-line bg-cockpit-ink p-3 text-sm text-white outline-none focus:border-cockpit-glow"
              placeholder="Adicionar nota"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap justify-between gap-2">
              <button
                className="rounded-md border border-cockpit-red/40 px-4 py-2 text-sm font-semibold text-cockpit-red hover:bg-cockpit-red/10 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!noteDraft.trim() && !hasNote}
                onClick={deleteNote}
                type="button"
              >
                Deletar
              </button>
              <div className="flex gap-2">
                <button className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10" onClick={closeNotes} type="button">
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
