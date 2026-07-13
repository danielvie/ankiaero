import { cardById, cards, subjects } from "./cards";
import type { Card } from "./types";

const activeKey = "anki-aero-simulation-active-v1";
const historyKey = "anki-aero-simulation-history-v1";

export type SimulationSession = {
  id: string;
  startedAt: number;
  questionIds: string[];
  answers: Record<string, string>;
  currentIndex: number;
};

export type SimulationResult = SimulationSession & { finishedAt: number };

export function createSimulation(): SimulationSession {
  const questionIds = subjects.flatMap((subject) => {
    const pool = cards.filter((card) => card.subject === subject);
    for (let index = pool.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
    }
    return pool.slice(0, 20).map((card) => card.id);
  });

  return { id: crypto.randomUUID(), startedAt: Date.now(), questionIds, answers: {}, currentIndex: 0 };
}

export function loadActiveSimulation() {
  return readJson(activeKey, isSession) ?? null;
}

export function saveActiveSimulation(session: SimulationSession | null) {
  if (session) localStorage.setItem(activeKey, JSON.stringify(session));
  else localStorage.removeItem(activeKey);
}

export function loadSimulationHistory() {
  const raw = readJson(historyKey, Array.isArray);
  return raw ? raw.filter(isResult) : [];
}

export function saveSimulationHistory(history: SimulationResult[]) {
  localStorage.setItem(historyKey, JSON.stringify(history));
}

export function getSimulationSubjectProgress(session: SimulationSession, subjectIndex: number) {
  const start = subjectIndex * 20;
  const questionIds = session.questionIds.slice(start, start + 20);
  const answered = questionIds.filter((id) => session.answers[id]).length;
  const firstUnanswered = questionIds.findIndex((id) => !session.answers[id]);
  return { answered, currentIndex: start + (firstUnanswered === -1 ? 19 : firstUnanswered) };
}

export function summarizeSimulation(result: SimulationResult) {
  const bySubject = subjects.map((subject) => {
    const items = result.questionIds
      .map((id) => cardById.get(id))
      .filter((card): card is Card => card?.subject === subject)
      .map((card) => ({
        card,
        selectedAnswer: result.answers[card.id] ?? null,
        answeredCorrectly: result.answers[card.id] === card.answer
      }));
    const correct = items.filter((item) => item.answeredCorrectly).length;
    return { subject, correct, total: items.length, percent: Math.round((correct / items.length) * 100), items };
  });
  const correct = bySubject.reduce((total, subject) => total + subject.correct, 0);
  return { correct, total: result.questionIds.length, percent: Math.round((correct / result.questionIds.length) * 100), bySubject };
}

function readJson<T>(key: string, validate: (value: unknown) => value is T): T | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    return validate(value) ? value : null;
  } catch {
    return null;
  }
}

function isSession(value: unknown): value is SimulationSession {
  if (!value || typeof value !== "object") return false;
  const session = value as SimulationSession;
  return typeof session.id === "string"
    && typeof session.startedAt === "number"
    && Array.isArray(session.questionIds)
    && session.questionIds.length === 100
    && new Set(session.questionIds).size === 100
    && session.questionIds.every((id) => typeof id === "string" && cardById.has(id))
    && Number.isInteger(session.currentIndex)
    && session.currentIndex >= 0
    && session.currentIndex < 100
    && !!session.answers
    && typeof session.answers === "object"
    && Object.entries(session.answers).every(([id, answer]) => typeof answer === "string" && cardById.get(id)?.options.includes(answer));
}

function isResult(value: unknown): value is SimulationResult {
  return isSession(value) && typeof (value as SimulationResult).finishedAt === "number";
}
