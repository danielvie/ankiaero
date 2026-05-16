import { cards, subjects } from "./cards";
import type { SubjectFilter } from "./appTypes";
import type { Card, CardProgress, SubjectName } from "./types";

export type StudyStats = {
  total: number;
  due: number;
  reviewed: number;
  accuracy: number;
};

export type SubjectRow = {
  subject: SubjectName;
  total: number;
  due: number;
  reviewed: number;
  accuracy: number;
};

export function pickNextCard(progress: Record<string, CardProgress>, subject: SubjectFilter, nowMs = Date.now()) {
  const pool = cards
    .filter((card) => subject === "ALL" || card.subject === subject)
    .map((card) => ({ card, progress: progress[card.id] }))
    .filter((item) => item.progress.dueAt <= nowMs)
    .sort((a, b) => a.progress.dueAt - b.progress.dueAt || a.card.id.localeCompare(b.card.id));

  return pool[0]?.card ?? null;
}

export function getStudyStats(progress: Record<string, CardProgress>, subject: SubjectFilter, nowMs = Date.now()): StudyStats {
  const relevant = cards.filter((card) => subject === "ALL" || card.subject === subject);
  const due = relevant.filter((card) => progress[card.id].dueAt <= nowMs).length;
  const reviewed = relevant.filter((card) => progress[card.id].attempts > 0).length;
  const attempts = relevant.reduce((sum, card) => sum + progress[card.id].attempts, 0);
  const correct = relevant.reduce((sum, card) => sum + progress[card.id].correctAttempts, 0);

  return {
    total: relevant.length,
    due,
    reviewed,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : 0
  };
}

export function getSubjectRows(progress: Record<string, CardProgress>, nowMs = Date.now()): SubjectRow[] {
  return subjects.map((subject) => {
    const subjectCards = cards.filter((card) => card.subject === subject);
    const due = subjectCards.filter((card) => progress[card.id].dueAt <= nowMs).length;
    const reviewed = subjectCards.filter((card) => progress[card.id].attempts > 0).length;
    const attempts = subjectCards.reduce((sum, card) => sum + progress[card.id].attempts, 0);
    const correct = subjectCards.reduce((sum, card) => sum + progress[card.id].correctAttempts, 0);
    const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
    return { subject, total: subjectCards.length, due, reviewed, accuracy };
  });
}

export function searchCards(query: string, subject: SubjectFilter): Card[] {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  return cards.filter((card) => {
    const inSubject = subject === "ALL" || card.subject === subject;
    if (!inSubject) return false;
    if (!normalized) return true;
    return `${card.question} ${card.options.join(" ")}`.toLocaleLowerCase("pt-BR").includes(normalized);
  });
}
