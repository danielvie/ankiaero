import { cards } from "./cards";
import { createProgress } from "./scheduler";
import type { CardProgress } from "./types";

const storageKey = "anki-aero-progress-v1";

type StoredProgress = {
  version: 1;
  cards: Record<string, CardProgress>;
};

export function loadProgress(): Record<string, CardProgress> {
  const fresh = Object.fromEntries(cards.map((card) => [card.id, createProgress(card.id)]));
  const raw = localStorage.getItem(storageKey);
  if (!raw) return fresh;

  try {
    const parsed = JSON.parse(raw) as StoredProgress;
    if (parsed.version !== 1 || !parsed.cards) return fresh;
    return { ...fresh, ...parsed.cards };
  } catch {
    return fresh;
  }
}

export function saveProgress(progress: Record<string, CardProgress>) {
  const payload: StoredProgress = { version: 1, cards: progress };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

export function exportProgress(progress: Record<string, CardProgress>) {
  return JSON.stringify({ version: 1, cards: progress }, null, 2);
}

export function importProgress(raw: string): Record<string, CardProgress> {
  const parsed = JSON.parse(raw) as StoredProgress;
  if (parsed.version !== 1 || !parsed.cards) throw new Error("Invalid progress file");
  const fresh = loadProgress();
  return { ...fresh, ...parsed.cards };
}
