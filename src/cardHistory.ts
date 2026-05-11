const cardHistoryKey = "anki-aero-card-history";
const maxHistoryCards = 100;

export function loadCardHistory() {
  const raw = localStorage.getItem(cardHistoryKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function saveCardHistory(cardIds: string[]) {
  localStorage.setItem(cardHistoryKey, JSON.stringify(cardIds.slice(0, maxHistoryCards)));
}

export function addCardToHistory(cardIds: string[], cardId: string) {
  return [cardId, ...cardIds.filter((currentCardId) => currentCardId !== cardId)].slice(0, maxHistoryCards);
}
