import { useEffect, useMemo, useRef, useState } from "react";
import { cards } from "../cards";
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
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const reviewHistoryPushed = useRef(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveMarkedCards(markedCardIds);
  }, [markedCardIds]);

  useEffect(() => {
    const handlePopState = () => {
      if (!reviewHistoryPushed.current) return;
      reviewHistoryPushed.current = false;
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

  const filteredCards = useMemo(() => {
    const searchResult = searchCards(query, subject);
    if (!showMarkedOnly) return searchResult;
    return searchResult.filter((card) => markedCardIds.has(card.id));
  }, [markedCardIds, query, showMarkedOnly, subject]);

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

  const pushReviewHistory = () => {
    if (reviewHistoryPushed.current) return;
    window.history.pushState({ ankiAeroView: "review" }, "", window.location.href);
    reviewHistoryPushed.current = true;
  };

  const changeView = (nextView: View) => {
    if (nextView === "review" && view !== "review") {
      setPreviousView(view);
      pushReviewHistory();
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
      pushReviewHistory();
    }
    setActiveCardId(card.id);
    setSelectedAnswer(null);
    setRevealed(false);
    setView("review");
  };

  const startReview = (nextSubject: SubjectFilter = subject) => {
    if (view !== "review") {
      setPreviousView(view);
      pushReviewHistory();
    }
    setSubject(nextSubject);
    setActiveCardId(null);
    setSelectedAnswer(null);
    setRevealed(false);
    setView("review");
  };

  const returnFromReview = () => {
    if (reviewHistoryPushed.current) {
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
    showMarkedOnly,
    setShowMarkedOnly,
    importText,
    setImportText,
    filteredCards,
    chooseAnswer,
    gradeAnswer,
    startReview,
    returnFromReview,
    reviewSpecificCard,
    resetCard,
    toggleMarkedCard,
    resetAll,
    exportToClipboard,
    applyImport
  };
}
