import type { CardProgress, Grade } from "./types";

const dayMs = 24 * 60 * 60 * 1000;

export function createProgress(cardId: string, now = Date.now()): CardProgress {
  return {
    cardId,
    dueAt: now,
    intervalDays: 0,
    ease: 2.5,
    repetitions: 0,
    lapses: 0,
    attempts: 0,
    correctAttempts: 0
  };
}

export function scheduleCard(
  current: CardProgress,
  grade: Grade,
  answeredCorrectly: boolean,
  now = Date.now()
): CardProgress {
  const attempts = current.attempts + 1;
  const correctAttempts = current.correctAttempts + (answeredCorrectly ? 1 : 0);
  const next: CardProgress = {
    ...current,
    attempts,
    correctAttempts,
    lastGrade: grade,
    lastAnsweredAt: now
  };

  if (!answeredCorrectly) {
    return {
      ...next,
      dueAt: now,
      intervalDays: 0,
      ease: Math.max(1.3, current.ease - 0.2),
      repetitions: 0,
      lapses: current.lapses + 1
    };
  }

  if (grade === "again") {
    return {
      ...next,
      dueAt: now + 10 * 60 * 1000,
      intervalDays: 0,
      ease: Math.max(1.3, current.ease - 0.2),
      repetitions: 0,
      lapses: current.lapses + 1
    };
  }

  const easeDelta = grade === "hard" ? -0.15 : grade === "easy" ? 0.15 : 0;
  const ease = Math.max(1.3, current.ease + easeDelta);
  const repetitions = current.repetitions + 1;
  const baseInterval =
    repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(1, Math.round(current.intervalDays * ease));
  const multiplier = grade === "hard" ? 0.6 : grade === "easy" ? 1.7 : 1;
  const intervalDays = Math.max(1, Math.round(baseInterval * multiplier));

  return {
    ...next,
    dueAt: now + intervalDays * dayMs,
    intervalDays,
    ease,
    repetitions
  };
}

export function previewSchedule(
  current: CardProgress,
  grade: Grade,
  answeredCorrectly: boolean,
  now = Date.now()
) {
  return formatDueTime(scheduleCard(current, grade, answeredCorrectly, now).dueAt, now);
}

export function formatDueTime(dueAt: number, now = Date.now()) {
  const delta = dueAt - now;
  if (delta <= 0) return "agora";
  const minutes = Math.ceil(delta / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.ceil(hours / 24)}d`;
}
