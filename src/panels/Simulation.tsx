import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { cardById, subjects } from "../cards";
import {
  createSimulation,
  getSimulationSubjectProgress,
  loadActiveSimulation,
  loadSimulationHistory,
  saveActiveSimulation,
  saveSimulationHistory,
  summarizeSimulation,
  type SimulationResult,
  type SimulationSession
} from "../simulation";
import type { SubjectName } from "../types";

const mobileSubjectLabels: Record<SubjectName, string> = {
  "REGULAMENTOS": "REGUL.",
  "METEOROLOGIA": "METEO",
  "NAVEGAÇÃO": "NAVEG.",
  "TEORIA DE VÔO": "VÔO",
  "CONHECIMENTOS TÉCNICOS": "TÉCNICOS"
};

export function Simulation() {
  const [active, setActive] = useState<SimulationSession | null>(() => loadActiveSimulation());
  const [history, setHistory] = useState<SimulationResult[]>(() => loadSimulationHistory());
  const [inProgress, setInProgress] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const start = () => {
    const session = createSimulation();
    saveActiveSimulation(session);
    setActive(session);
    setResult(null);
    setInProgress(true);
  };

  const restart = () => {
    if (!window.confirm("Reiniciar e descartar as respostas deste Simulado?")) return;
    start();
  };

  const updateActive = (next: SimulationSession) => {
    saveActiveSimulation(next);
    setActive(next);
  };

  const finish = () => {
    if (!active) return;
    const unanswered = active.questionIds.length - Object.keys(active.answers).length;
    if (!window.confirm(`Terminar o Simulado? ${unanswered} ${unanswered === 1 ? "questão não respondida contará" : "questões não respondidas contarão"} como erro.`)) return;
    const finished = { ...active, finishedAt: Date.now() };
    const nextHistory = [finished, ...history];
    saveActiveSimulation(null);
    saveSimulationHistory(nextHistory);
    setActive(null);
    setHistory(nextHistory);
    setInProgress(false);
    setResult(finished);
  };

  if (result) return <SimulationResultView result={result} onBack={() => setResult(null)} />;
  if (active && inProgress) return <SimulationQuestions session={active} update={updateActive} finish={finish} />;

  return (
    <div>
      <header className="border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-[18px] pb-3 pt-5">
        <h1 className="text-xs font-bold tracking-[0.16em] text-cockpit-accent">SIMULADO</h1>
        <small className="mt-1 block text-[9px] tracking-[0.06em] text-cockpit-dim">100 QUESTÕES · 20 POR MATÉRIA</small>
      </header>
      <section className="grid gap-3 px-4 py-5">
        <div className="rounded-lg border border-cockpit-line bg-cockpit-panel p-4">
          <ClipboardCheck className="mb-3 text-cockpit-accent" size={28} />
          <h2 className="text-lg font-semibold text-cockpit-bright">Simulado ANAC</h2>
          <p className="mt-2 text-sm leading-relaxed text-cockpit-muted">As questões aparecem agrupadas por Matéria. A correção e os percentuais serão mostrados somente ao terminar.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {active ? (
              <>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-cockpit-accent px-4 py-3 text-sm text-cockpit-text hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={() => setInProgress(true)} type="button">
                  <ChevronRight size={18} /> CONTINUAR
                </button>
                <button className="flex items-center justify-center gap-2 rounded-md border border-cockpit-line px-4 py-3 text-sm text-cockpit-soft hover:bg-white/5" onClick={restart} type="button">
                  <RotateCcw size={17} /> REINICIAR
                </button>
              </>
            ) : (
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-cockpit-accent px-4 py-3 text-sm text-cockpit-text hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink" onClick={start} type="button">
                <ClipboardCheck size={18} /> INICIAR SIMULADO
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="px-4 pb-6">
        <h2 className="mb-3 text-xs font-bold tracking-[0.12em] text-cockpit-accent">HISTÓRICO DE SIMULADOS</h2>
        <div className="grid gap-2">
          {history.map((item) => {
            const summary = summarizeSimulation(item);
            return (
              <button className="flex items-center justify-between rounded-md border border-cockpit-line bg-cockpit-panel px-4 py-3 text-left hover:border-cockpit-accent" key={item.id} onClick={() => setResult(item)} type="button">
                <span><b className="block text-sm text-cockpit-bright">{summary.percent}% DE ACERTO</b><small className="mt-1 block text-xs text-cockpit-muted">{formatDate(item.finishedAt)}</small></span>
                <ChevronRight className="text-cockpit-accent" size={18} />
              </button>
            );
          })}
          {!history.length && <p className="rounded-md border border-cockpit-line bg-cockpit-panel px-4 py-8 text-center text-sm text-cockpit-muted">NENHUM SIMULADO CONCLUÍDO</p>}
        </div>
      </section>
    </div>
  );
}

function SimulationQuestions({ session, update, finish }: { session: SimulationSession; update: (session: SimulationSession) => void; finish: () => void }) {
  const card = cardById.get(session.questionIds[session.currentIndex]);
  if (!card) return null;
  const selectedAnswer = session.answers[card.id];
  const numberInSubject = (session.currentIndex % 20) + 1;
  const subjectProgress = subjects.map((subject, subjectIndex) => ({ subject, ...getSimulationSubjectProgress(session, subjectIndex) }));

  const move = (currentIndex: number) => update({ ...session, currentIndex });
  const answer = (selected: string) => update({ ...session, answers: { ...session.answers, [card.id]: selected } });
  const changeSubject = (subject: string) => {
    const progress = subjectProgress.find((item) => item.subject === subject);
    if (progress && progress.subject !== card.subject) move(progress.currentIndex);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col">
      <header className="border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="hidden text-sm font-semibold text-cockpit-accent sm:inline">{card.subject}</span>
          <b className="text-sm text-cockpit-bright">{numberInSubject}/20</b>
        </div>
        <nav aria-label="Matérias do Simulado" className="mt-3 grid grid-cols-6 gap-2 sm:hidden">
          {subjectProgress.map((progress, index) => {
            const active = progress.subject === card.subject;
            const centered = index === 3 ? "col-start-2" : index === 4 ? "col-start-4" : "";
            return (
              <button
                aria-label={`${progress.subject}: ${progress.answered}/20 respondidas`}
                aria-pressed={active}
                className={`col-span-2 min-w-0 rounded border px-1 py-2 text-center transition ${centered} ${active ? "border-cockpit-accent bg-cockpit-accent/10 text-cockpit-bright" : "border-cockpit-line text-cockpit-soft"}`}
                key={progress.subject}
                onClick={() => changeSubject(progress.subject)}
                type="button"
              >
                <span className="block truncate text-xs font-semibold">{mobileSubjectLabels[progress.subject]}</span>
                <small className="mt-1 block text-[9px] text-cockpit-muted">{progress.answered}/20</small>
              </button>
            );
          })}
        </nav>
        <nav aria-label="Matérias do Simulado" className="mt-3 hidden gap-2 overflow-x-auto pb-1 sm:flex">
          {subjectProgress.map((progress) => {
            const active = progress.subject === card.subject;
            return (
              <button
                aria-label={`${progress.subject}: ${progress.answered}/20 respondidas`}
                aria-pressed={active}
                className={`shrink-0 rounded border px-3 py-2 text-left transition ${active ? "border-cockpit-accent bg-cockpit-accent/10 text-cockpit-bright" : "border-cockpit-line text-cockpit-soft hover:border-cockpit-accent"}`}
                key={progress.subject}
                onClick={() => changeSubject(progress.subject)}
                type="button"
              >
                <span className="block text-xs font-semibold">{progress.subject}</span>
                <small className="mt-1 block text-[9px] text-cockpit-muted">{progress.answered}/20 RESPONDIDAS</small>
              </button>
            );
          })}
        </nav>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-cockpit-line px-3 py-2 text-xs tracking-[0.08em] text-cockpit-soft hover:border-cockpit-accent" onClick={finish} type="button">
          <CheckCircle2 size={16} /> TERMINAR SIMULADO
        </button>
      </header>
      <section className="mx-4 mt-5 rounded-lg border border-cockpit-line bg-cockpit-panel">
        <h2 className="px-4 pb-5 pt-5 text-base leading-relaxed text-cockpit-bright">{card.question}</h2>
        <div className="grid gap-3 px-3 pb-3">
          {card.options.map((option) => {
            const match = option.match(/^([A-E])\)\s*([\s\S]*)$/);
            const isSelected = selectedAnswer === option;
            return (
              <button aria-pressed={isSelected} className={`flex items-start gap-3 rounded-md border px-3 py-3.5 text-left text-sm leading-relaxed transition ${isSelected ? "border-cockpit-accent bg-cockpit-accent/10 text-cockpit-bright" : "border-cockpit-line bg-cockpit-ink/50 text-cockpit-text hover:border-cockpit-accent"}`} key={option} onClick={() => answer(option)} type="button">
                {match && <span className={`flex size-6 shrink-0 items-center justify-center rounded text-xs font-semibold ${isSelected ? "bg-cockpit-accent text-cockpit-ink" : "bg-cockpit-line/60 text-cockpit-soft"}`}>{match[1]}</span>}
                <span className="pt-0.5">{match?.[2] ?? option}</span>
              </button>
            );
          })}
        </div>
      </section>
      <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-5">
        <button className="flex items-center justify-center gap-2 rounded-md border border-cockpit-line px-3 py-3 text-sm text-cockpit-soft hover:bg-cockpit-panel disabled:opacity-30" disabled={session.currentIndex === 0} onClick={() => move(session.currentIndex - 1)} type="button"><ChevronLeft size={18} /> ANTERIOR</button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-cockpit-accent px-3 py-3 text-sm text-cockpit-text hover:bg-cockpit-accent hover:font-semibold hover:text-cockpit-ink disabled:opacity-30" disabled={session.currentIndex === 99} onClick={() => move(session.currentIndex + 1)} type="button">PRÓXIMA <ChevronRight size={18} /></button>
      </div>
    </div>
  );
}

function SimulationResultView({ result, onBack }: { result: SimulationResult; onBack: () => void }) {
  const summary = summarizeSimulation(result);
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | null>(null);
  const details = summary.bySubject.find((item) => item.subject === selectedSubject);

  return (
    <div>
      <header className="border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-4 py-3">
        <button className="flex items-center gap-1 text-sm text-cockpit-accent hover:text-cockpit-bright" onClick={onBack} type="button"><ChevronLeft size={16} /> SIMULADO</button>
      </header>
      <section className="px-4 py-5 text-center">
        <small className="text-xs tracking-[0.12em] text-cockpit-muted">RESULTADO FINAL</small>
        <strong className="mt-2 block text-5xl text-cockpit-bright">{summary.percent}%</strong>
        <p className="mt-2 text-sm text-cockpit-muted">{summary.correct}/{summary.total} questões corretas</p>
      </section>
      <section className="grid gap-2 px-4 pb-5">
        {summary.bySubject.map((item) => (
          <button className={`flex items-center justify-between rounded-md border bg-cockpit-panel px-4 py-3 text-left ${selectedSubject === item.subject ? "border-cockpit-accent" : "border-cockpit-line hover:border-cockpit-accent"}`} key={item.subject} onClick={() => setSelectedSubject(selectedSubject === item.subject ? null : item.subject)} type="button">
            <span><b className="block text-sm text-cockpit-bright">{item.subject}</b><small className="mt-1 block text-xs text-cockpit-muted">{item.correct}/{item.total} corretas</small></span>
            <strong className="text-xl text-cockpit-accent">{item.percent}%</strong>
          </button>
        ))}
      </section>
      {details && (
        <section className="grid gap-2 border-t border-cockpit-line px-4 py-5">
          <h2 className="mb-1 text-sm font-semibold text-cockpit-accent">{details.subject}</h2>
          {details.items.map((item, index) => (
            <article className={`rounded-md border p-3 ${item.answeredCorrectly ? "border-cockpit-green/40 bg-cockpit-green/5" : "border-cockpit-red/40 bg-cockpit-red/5"}`} key={item.card.id}>
              <div className="flex justify-between gap-2 text-xs"><b className="text-cockpit-bright">QUESTÃO {index + 1}/20</b><span className={item.answeredCorrectly ? "text-cockpit-green" : "text-cockpit-red"}>{item.answeredCorrectly ? "ACERTOU" : "ERROU"}</span></div>
              <p className="mt-2 text-sm leading-relaxed text-cockpit-text">{item.card.question}</p>
              <p className="mt-3 text-xs leading-relaxed text-cockpit-muted">SUA RESPOSTA: <span className="text-cockpit-text">{item.selectedAnswer ?? "NÃO RESPONDIDA"}</span></p>
              <p className="mt-1 text-xs leading-relaxed text-cockpit-muted">CORRETA: <span className="text-cockpit-green">{item.card.answer}</span></p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(timestamp);
}
