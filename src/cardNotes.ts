const cardNotesKey = "anki-aero-card-notes-v1";

export function loadCardNotes(): Record<string, string> {
  const raw = localStorage.getItem(cardNotesKey);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCardNotes(notes: Record<string, string>) {
  localStorage.setItem(cardNotesKey, JSON.stringify(notes));
}
