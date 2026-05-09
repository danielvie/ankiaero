import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Upload,
  XCircle
} from "lucide-react";
import { cards, subjects } from "./cards";
import { exportProgress, importProgress, loadProgress, saveProgress } from "./storage";
import { formatDueTime, scheduleCard } from "./scheduler";
import type { Card, CardProgress, Grade, SubjectName } from "./types";

type View = "dashboard" | "review" | "browse" | "settings";
type SubjectFilter = SubjectName | "ALL";

const gradeLabels: Record<Grade, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy"
};

function pickNextCard(progress: Record<string, CardProgress>, subject: SubjectFilter, now = Date.now()) {
  const pool = cards
    .filter((card) => subject === "ALL" || card.subject === subject)
    .map((card) => ({ card, progress: progress[card.id] }))
    .sort((a, b) => a.progress.dueAt - b.progress.dueAt || a.card.id.localeCompare(b.card.id));

  return pool.find((item) => item.progress.dueAt <= now)?.card ?? pool[0]?.card ?? null;
}

function optionLetter(option: string) {
  return option.match(/^[A-D]\)/)?.[0] ?? "";
}

type AppProps = {
  updateReady: boolean;
  onConfirmUpdate: () => void;
  onDismissUpdate: () => void;
};

export default function App({ updateReady, onConfirmUpdate, onDismissUpdate }: AppProps) {
  const [view, setView] = useState<View>("dashboard");
  const [subject, setSubject] = useState<SubjectFilter>("ALL");
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState("");
  const [importText, setImportText] = useState("");

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const stats = useMemo(() => {
    const now = Date.now();
    const relevant = cards.filter((card) => subject === "ALL" || card.subject === subject);
    const due = relevant.filter((card) => progress[card.id].dueAt <= now).length;
    const reviewed = relevant.filter((card) => progress[card.id].attempts > 0).length;
    const attempts = relevant.reduce((sum, card) => sum + progress[card.id].attempts, 0);
    const correct = relevant.reduce((sum, card) => sum + progress[card.id].correctAttempts, 0);
    return {
      total: relevant.length,
      due,
      reviewed,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0
    };
  }, [progress, subject]);

  const activeCard = useMemo(() => {
    if (activeCardId) return cards.find((card) => card.id === activeCardId) ?? null;
    return pickNextCard(progress, subject);
  }, [activeCardId, progress, subject]);

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return cards.filter((card) => {
      const inSubject = subject === "ALL" || card.subject === subject;
      if (!inSubject) return false;
      if (!normalized) return true;
      return `${card.question} ${card.options.join(" ")}`.toLocaleLowerCase("pt-BR").includes(normalized);
    });
  }, [query, subject]);

  const chooseAnswer = (answer: string) => {
    if (revealed) return;
    setSelectedAnswer(answer);
    setRevealed(true);
  };

  const gradeAnswer = (grade: Grade) => {
    if (!activeCard || !selectedAnswer) return;
    const answeredCorrectly = selectedAnswer === activeCard.answer;
    setProgress((current) => ({
      ...current,
      [activeCard.id]: scheduleCard(current[activeCard.id], grade, answeredCorrectly)
    }));
    setSelectedAnswer(null);
    setRevealed(false);
    setActiveCardId(null);
  };

  const reviewSpecificCard = (card: Card) => {
    setActiveCardId(card.id);
    setSelectedAnswer(null);
    setRevealed(false);
    setView("review");
  };

  const resetCard = (cardId: string) => {
    setProgress((current) => ({
      ...current,
      [cardId]: { ...current[cardId], dueAt: Date.now(), intervalDays: 0, repetitions: 0 }
    }));
  };

  const resetAll = () => {
    const fresh = loadProgress();
    for (const card of cards) {
      fresh[card.id] = { ...fresh[card.id], dueAt: Date.now(), intervalDays: 0, repetitions: 0 };
    }
    setProgress(fresh);
  };

  const exportToClipboard = async () => {
    await navigator.clipboard.writeText(exportProgress(progress));
  };

  const applyImport = () => {
    setProgress(importProgress(importText));
    setImportText("");
  };

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-white/10 bg-cockpit-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cockpit-glow">ANAC deck</p>
            <h1 className="text-2xl font-semibold text-white">Anki Aero</h1>
          </div>
          <nav className="grid grid-cols-4 gap-2 rounded-md border border-white/10 bg-white/5 p-1">
            <NavButton active={view === "dashboard"} icon={<BarChart3 size={18} />} label="Painel" onClick={() => setView("dashboard")} />
            <NavButton active={view === "review"} icon={<BookOpen size={18} />} label="Revisar" onClick={() => setView("review")} />
            <NavButton active={view === "browse"} icon={<Search size={18} />} label="Buscar" onClick={() => setView("browse")} />
            <NavButton active={view === "settings"} icon={<Settings size={18} />} label="Dados" onClick={() => setView("settings")} />
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-4 shadow-2xl shadow-black/20">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Matéria</label>
          <select
            className="mt-2 w-full rounded-md border border-cockpit-line bg-cockpit-ink px-3 py-2 text-sm text-white"
            value={subject}
            onChange={(event) => setSubject(event.target.value as SubjectFilter)}
          >
            <option value="ALL">Todas</option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Due" value={stats.due} tone="text-cockpit-amber" />
            <Stat label="Total" value={stats.total} tone="text-cockpit-glow" />
            <Stat label="Done" value={stats.reviewed} tone="text-cockpit-green" />
            <Stat label="Hit" value={`${stats.accuracy}%`} tone="text-white" />
          </div>
        </aside>

        <section>
          {view === "dashboard" && <Dashboard progress={progress} subject={subject} startReview={() => setView("review")} />}
          {view === "review" && activeCard && (
            <Review
              card={activeCard}
              progress={progress[activeCard.id]}
              selectedAnswer={selectedAnswer}
              revealed={revealed}
              chooseAnswer={chooseAnswer}
              gradeAnswer={gradeAnswer}
            />
          )}
          {view === "browse" && (
            <Browse cards={filteredCards} progress={progress} query={query} setQuery={setQuery} reviewCard={reviewSpecificCard} resetCard={resetCard} />
          )}
          {view === "settings" && (
            <SettingsView
              importText={importText}
              setImportText={setImportText}
              exportToClipboard={exportToClipboard}
              applyImport={applyImport}
              resetAll={resetAll}
            />
          )}
        </section>
      </main>
      {updateReady && <UpdatePrompt onConfirm={onConfirmUpdate} onDismiss={onDismissUpdate} />}
    </div>
  );
}

function UpdatePrompt({ onConfirm, onDismiss }: { onConfirm: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-lg border border-cockpit-glow/40 bg-cockpit-panel p-4 shadow-2xl shadow-black/50">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-cockpit-glow/15 text-cockpit-glow">
          <RefreshCw size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-white">Nova versão disponível</h2>
          <p className="mt-1 text-sm text-slate-300">Atualize agora para carregar novos arquivos do app.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10" onClick={onDismiss} type="button">
          Depois
        </button>
        <button className="rounded-md bg-cockpit-glow px-3 py-2 text-sm font-semibold text-cockpit-ink hover:brightness-110" onClick={onConfirm} type="button">
          Atualizar
        </button>
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm transition ${
        active ? "bg-cockpit-glow text-cockpit-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}

function Dashboard({
  progress,
  subject,
  startReview
}: {
  progress: Record<string, CardProgress>;
  subject: SubjectFilter;
  startReview: () => void;
}) {
  const rows = subjects.map((item) => {
    const subjectCards = cards.filter((card) => card.subject === item);
    const due = subjectCards.filter((card) => progress[card.id].dueAt <= Date.now()).length;
    const reviewed = subjectCards.filter((card) => progress[card.id].attempts > 0).length;
    return { subject: item, total: subjectCards.length, due, reviewed };
  });

  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cockpit-amber">spaced repetition</p>
          <h2 className="mt-2 text-3xl font-semibold">Fila de estudo</h2>
        </div>
        <button className="rounded-md bg-cockpit-amber px-4 py-3 font-semibold text-cockpit-ink hover:brightness-110" onClick={startReview} type="button">
          Revisar agora
        </button>
      </div>
      <div className="mt-6 grid gap-3">
        {rows
          .filter((row) => subject === "ALL" || row.subject === subject)
          .map((row) => (
            <div key={row.subject} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="font-semibold">{row.subject}</div>
                <div className="font-mono text-sm text-slate-300">
                  {row.due} due / {row.total}
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded bg-cockpit-ink">
                <div className="h-full bg-cockpit-glow" style={{ width: `${Math.round((row.reviewed / row.total) * 100)}%` }} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function Review({
  card,
  progress,
  selectedAnswer,
  revealed,
  chooseAnswer,
  gradeAnswer
}: {
  card: Card;
  progress: CardProgress;
  selectedAnswer: string | null;
  revealed: boolean;
  chooseAnswer: (answer: string) => void;
  gradeAnswer: (grade: Grade) => void;
}) {
  const correct = selectedAnswer === card.answer;

  return (
    <div className="answer-panel rounded-lg border border-white/10 p-5 shadow-2xl shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-cockpit-glow">{card.subject}</p>
          <p className="mt-1 text-sm text-slate-400">Next: {formatDueTime(progress.dueAt)}</p>
        </div>
        <div className="rounded-md border border-white/10 px-3 py-2 font-mono text-sm text-slate-300">
          {progress.attempts} tries · {progress.intervalDays}d interval
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

function Browse({
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
        {cards.slice(0, 200).map((card) => (
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

function SettingsView({
  importText,
  setImportText,
  exportToClipboard,
  applyImport,
  resetAll
}: {
  importText: string;
  setImportText: (text: string) => void;
  exportToClipboard: () => void;
  applyImport: () => void;
  resetAll: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <h2 className="text-2xl font-semibold">Dados locais</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <button className="flex items-center justify-center gap-2 rounded-md bg-cockpit-glow px-4 py-3 font-semibold text-cockpit-ink" onClick={exportToClipboard} type="button">
          <Download size={18} /> Exportar
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white" onClick={applyImport} type="button">
          <Upload size={18} /> Importar
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-cockpit-red/40 bg-cockpit-red/10 px-4 py-3 font-semibold text-cockpit-red" onClick={resetAll} type="button">
          <RotateCcw size={18} /> Resetar
        </button>
      </div>
      <textarea
        className="mt-4 min-h-52 w-full rounded-md border border-cockpit-line bg-cockpit-ink p-3 font-mono text-sm text-slate-200"
        placeholder="Cole JSON exportado aqui para importar."
        value={importText}
        onChange={(event) => setImportText(event.target.value)}
      />
    </div>
  );
}
