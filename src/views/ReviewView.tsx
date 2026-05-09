import { CheckCircle2, Star, XCircle } from "lucide-react";
import { formatDueTime } from "../scheduler";
import type { Card, CardProgress, Grade } from "../types";

const gradeLabels: Record<Grade, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy"
};

function optionLetter(option: string) {
  return option.match(/^[A-D]\)/)?.[0] ?? "";
}

export function ReviewView({
  card,
  progress,
  isMarked,
  selectedAnswer,
  revealed,
  chooseAnswer,
  gradeAnswer,
  toggleMarked
}: {
  card: Card;
  progress: CardProgress;
  isMarked: boolean;
  selectedAnswer: string | null;
  revealed: boolean;
  chooseAnswer: (answer: string) => void;
  gradeAnswer: (grade: Grade) => void;
  toggleMarked: () => void;
}) {
  const correct = selectedAnswer === card.answer;

  return (
    <div className="answer-panel rounded-lg border border-white/10 p-5 shadow-2xl shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-cockpit-glow">{card.subject}</p>
          <p className="mt-1 text-sm text-slate-400">Next: {formatDueTime(progress.dueAt)}</p>
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
            Mark
          </button>
          <div className="rounded-md border border-white/10 px-3 py-2 font-mono text-sm text-slate-300">
            {progress.attempts} tries · {progress.intervalDays}d interval
          </div>
        </div>
      </div>

      <h2 className="mt-5 text-balance text-2xl font-semibold leading-snug text-white">{card.question}</h2>
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
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {(Object.keys(gradeLabels) as Grade[]).map((grade) => (
              <button
                key={grade}
                className="rounded-md border border-white/10 bg-white/10 px-3 py-3 font-semibold text-white hover:bg-white/15"
                onClick={() => gradeAnswer(grade)}
                type="button"
              >
                {gradeLabels[grade]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
