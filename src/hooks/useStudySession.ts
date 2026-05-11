import { useEffect, useMemo, useRef, useState } from "react";
import { cards } from "../cards";
import { addCardToHistory, loadCardHistory, saveCardHistory } from "../cardHistory";
import { loadCardNotes, saveCardNotes } from "../cardNotes";
import type { SubjectFilter, View } from "../appTypes";
import { exportProgress, importProgress, loadProgress, saveProgress } from "../storage";
import { loadMarkedCards, saveMarkedCards } from "../markedCards";
import { scheduleCard } from "../scheduler";
import { getStudyStats, pickNextCard, searchCards } from "../studyStats";
import type { Card, Grade } from "../types";

export function useStudySession() {
  const [view, setView] = useState<View>("dashboard");
  const [previousView, setPreviousView] = useState<View>("dashboard");
  const [subject, setSubject] = useState<SubjectFilter>("ALL");
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState("");
  const [importText, setImportText] = useState("");
  const [markedCardIds, setMarkedCardIds] = useState(() => loadMarkedCards());
  const [cardNotes, setCardNotes] = useState(() => loadCardNotes());
  const [cardHistoryIds, setCardHistoryIds] = useState(() => loadCardHistory());
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const navigationHistoryPushed = useRef(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveMarkedCards(markedCardIds);
  }, [markedCardIds]);

  useEffect(() => {
    saveCardNotes(cardNotes);
  }, [cardNotes]);

  useEffect(() => {
    saveCardHistory(cardHistoryIds);
  }, [cardHistoryIds]);

  useEffect(() => {
    const handlePopState = () => {
      if (!navigationHistoryPushed.current) return;
      navigationHistoryPushed.current = false;
      restorePreviousView();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [previousView]);

  const stats = useMemo(() => getStudyStats(progress, subject), [progress, subject]);

  const activeCard = useMemo(() => {
    if (activeCardId) return cards.find((card) => card.id === activeCardId) ?? null;
    return pickNextCard(progress, subject);
  }, [activeCardId, progress, subject]);

  useEffect(() => {
    if (view !== "review" || !activeCard) return;
    setCardHistoryIds((current) => addCardToHistory(current, activeCard.id));
  }, [activeCard?.id, view]);

  const filteredCards = useMemo(() => {
    const searchResult = searchCards(query, subject);
    if (!showMarkedOnly) return searchResult;
    return searchResult.filter((card) => markedCardIds.has(card.id));
  }, [markedCardIds, query, showMarkedOnly, subject]);

  const historyCards = useMemo(
    () => cardHistoryIds.map((cardId) => cards.find((card) => card.id === cardId)).filter((card): card is Card => Boolean(card)),
    [cardHistoryIds]
  );

  const chooseAnswer = (answer: string) => {
    if (revealed) return;
    setSelectedAnswer(answer);
    setRevealed(true);
  };

  const restorePreviousView = () => {
    setActiveCardId(null);
    setSelectedAnswer(null);
    setRevealed(false);
    setView(previousView === "review" ? "dashboard" : previousView);
  };

  const pushNavigationHistory = (nextView: View) => {
    if (nextView === "dashboard" || navigationHistoryPushed.current) return;
    window.history.pushState({ ankiAeroView: nextView }, "", window.location.href);
    navigationHistoryPushed.current = true;
  };

  const changeView = (nextView: View) => {
    if (nextView !== view) {
      setPreviousView(view);
      pushNavigationHistory(nextView);
    }
    setView(nextView);
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
    if (view !== "review") {
      setPreviousView(view);
      pushNavigationHistory("review");
    }
    setActiveCardId(card.id);
    setSelectedAnswer(null);
    setRevealed(false);
    setView("review");
  };

  const startReview = (nextSubject: SubjectFilter = subject) => {
    if (view !== "review") {
      setPreviousView(view);
      pushNavigationHistory("review");
    }
    setSubject(nextSubject);
    setActiveCardId(null);
    setSelectedAnswer(null);
    setRevealed(false);
    setView("review");
  };

  const returnToPreviousView = () => {
    if (navigationHistoryPushed.current) {
      window.history.back();
      return;
    }
    restorePreviousView();
  };

  const resetCard = (cardId: string) => {
    setProgress((current) => ({
      ...current,
      [cardId]: { ...current[cardId], dueAt: Date.now(), intervalDays: 0, repetitions: 0 }
    }));
  };

  const resetCards = (cardIds: string[]) => {
    const now = Date.now();
    setProgress((current) => {
      const next = { ...current };
      for (const cardId of cardIds) {
        next[cardId] = { ...next[cardId], dueAt: now, intervalDays: 0, repetitions: 0 };
      }
      return next;
    });
  };

  const toggleMarkedCard = (cardId: string) => {
    setMarkedCardIds((current) => {
      const next = new Set(current);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const saveCardNote = (cardId: string, note: string) => {
    setCardNotes((current) => {
      const next = { ...current };
      const trimmed = note.trim();
      if (trimmed) {
        next[cardId] = trimmed;
      } else {
        delete next[cardId];
      }
      return next;
    });
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

  return {
    view,
    setView: changeView,
    subject,
    setSubject,
    progress,
    stats,
    activeCard,
    selectedAnswer,
    revealed,
    query,
    setQuery,
    markedCardIds,
    cardNotes,
    showMarkedOnly,
    setShowMarkedOnly,
    importText,
    setImportText,
    filteredCards,
    historyCards,
    chooseAnswer,
    gradeAnswer,
    startReview,
    returnToPreviousView,
    reviewSpecificCard,
    resetCard,
    resetCards,
    saveCardNote,
    toggleMarkedCard,
    resetAll,
    exportToClipboard,
    applyImport
  };
}
