const markedCardsKey = "anki-aero-marked-cards-v1";

export function loadMarkedCards(): Set<string> {
  const raw = localStorage.getItem(markedCardsKey);
  if (!raw) return new Set();

  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function saveMarkedCards(markedCardIds: Set<string>) {
  localStorage.setItem(markedCardsKey, JSON.stringify([...markedCardIds]));
}
