import type { CardProgress, Grade } from "./types";

const dayMs = 24 * 60 * 60 * 1000;
const hourMs = 60 * 60 * 1000;
// "Again" means the answer was correct but not remembered well enough: review it again in 10 minutes.
const retryDelayMs = 10 * 60 * 1000;
const minEase = 1.3;

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
  const reviewed = recordReview(current, grade, answeredCorrectly, now);

  if (!answeredCorrectly) {
    return scheduleMissedAnswer(reviewed, current, now);
  }

  switch (grade) {
    case "again":
      return scheduleRetrySoon(reviewed, current, now);
    case "hard":
      return scheduleRememberedCard(reviewed, current, "hard", now);
    case "good":
      return scheduleRememberedCard(reviewed, current, "good", now);
    case "easy":
      return scheduleRememberedCard(reviewed, current, "easy", now);
  }
}

function recordReview(
  current: CardProgress,
  grade: Grade,
  answeredCorrectly: boolean,
  answeredAt: number
): CardProgress {
  return {
    ...current,
    attempts: current.attempts + 1,
    correctAttempts: current.correctAttempts + (answeredCorrectly ? 1 : 0),
    lastGrade: grade,
    lastAnsweredAt: answeredAt
  };
}

function scheduleMissedAnswer(reviewed: CardProgress, previous: CardProgress, now: number): CardProgress {
  return scheduleLapse(reviewed, previous, now);
}

function scheduleRetrySoon(reviewed: CardProgress, previous: CardProgress, now: number): CardProgress {
  return scheduleLapse(reviewed, previous, now + retryDelayMs);
}

function scheduleLapse(reviewed: CardProgress, previous: CardProgress, dueAt: number): CardProgress {
  return {
    ...reviewed,
    dueAt,
    intervalDays: 0,
    ease: reduceEase(previous.ease),
    repetitions: 0,
    lapses: previous.lapses + 1
  };
}

function scheduleRememberedCard(
  reviewed: CardProgress,
  previous: CardProgress,
  grade: Exclude<Grade, "again">,
  now: number
): CardProgress {
  const repetitions = previous.repetitions + 1;
  const ease = applyGradeToEase(previous.ease, grade);
  const baseIntervalDays = chooseBaseIntervalDays(previous.intervalDays, ease, repetitions);
  const intervalDays = roundSubDayIntervalToHours(applyGradeToInterval(baseIntervalDays, grade));

  return {
    ...reviewed,
    // The due date keeps fractional days; only sub-day waits are rounded to whole hours.
    dueAt: now + intervalDays * dayMs,
    intervalDays,
    ease,
    repetitions
  };
}

function chooseBaseIntervalDays(previousIntervalDays: number, ease: number, repetitions: number): number {
  // First success is scheduled for tomorrow.
  if (repetitions === 1) {
    return 1;
  }

  // Second success is scheduled for 3 days later.
  if (repetitions === 2) {
    return 3;
  }

  // Later successes grow from the previous interval multiplied by the card's ease.
  return Math.max(1, Math.round(previousIntervalDays * ease));
}

function applyGradeToEase(ease: number, grade: Exclude<Grade, "again">): number {
  // Hard answers reduce future growth; easy answers increase it.
  switch (grade) {
    case "hard":
      return Math.max(minEase, ease - 0.15);
    case "good":
      return ease;
    case "easy":
      return Math.max(minEase, ease + 0.15);
  }
}

function applyGradeToInterval(baseIntervalDays: number, grade: Exclude<Grade, "again">): number {
  switch (grade) {
    case "hard":
      // Hard keeps the card sooner: 60% of the base interval, allowing sub-day waits.
      return Math.max(1 / 24, baseIntervalDays * 0.6);
    case "good":
      // Good uses the base interval as-is.
      return baseIntervalDays;
    case "easy":
      // Easy pushes the card farther out: 170% of the base interval.
      return Math.max(1, baseIntervalDays * 1.7);
  }
}

function roundSubDayIntervalToHours(intervalDays: number): number {
  if (intervalDays >= 1) {
    return intervalDays;
  }

  const intervalMs = intervalDays * dayMs;
  return Math.max(hourMs, Math.round(intervalMs / hourMs) * hourMs) / dayMs;
}

function reduceEase(ease: number): number {
  return Math.max(minEase, ease - 0.2);
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
