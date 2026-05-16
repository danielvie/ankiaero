import { Agentation } from "agentation";
import { AppShell } from "./components/AppShell";
import { useStudySession } from "./hooks/useStudySession";
import { Browse } from "./panels/Browse";
import { Card } from "./panels/Card";
import { Dashboard } from "./panels/Dashboard";
import { History } from "./panels/History";
import { Settings } from "./panels/Settings";
import { Update } from "./panels/Update";

type AppProps = {
  updateReady: boolean;
  onConfirmUpdate: () => void;
  onDismissUpdate: () => void;
};

export default function App({ updateReady, onConfirmUpdate, onDismissUpdate }: AppProps) {
  const study = useStudySession();

  return (
    <>
      <AppShell
        view={study.view}
        onViewChange={study.setView}
        subject={study.subject}
        onSubjectChange={study.setSubject}
        stats={study.stats}
        markedCount={study.markedCardIds.size}
        onOpenMarked={study.openMarkedCards}
      >
        {study.view === "dashboard" && (
          <Dashboard progress={study.progress} startReview={study.startReview} />
        )}
        {study.view === "review" && study.activeCard && (
          <Card
            card={study.activeCard}
            progress={study.progress[study.activeCard.id]}
            dueCount={study.stats.due}
            isMarked={study.markedCardIds.has(study.activeCard.id)}
            note={study.cardNotes[study.activeCard.id] ?? ""}
            selectedAnswer={study.selectedAnswer}
            revealed={study.revealed}
            onBack={study.returnToPreviousView}
            chooseAnswer={study.chooseAnswer}
            gradeAnswer={study.gradeAnswer}
            saveNote={(note) => study.saveCardNote(study.activeCard!.id, note)}
            toggleMarked={() => study.toggleMarkedCard(study.activeCard!.id)}
          />
        )}
        {study.view === "review" && !study.activeCard && (
          <div className="answer-panel rounded-lg border border-white/10 p-6 shadow-2xl shadow-black/30">
            <button
              className="flex h-9 items-center justify-center rounded-md border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={study.returnToPreviousView}
              type="button"
            >
              Voltar
            </button>
            <h3 className="mt-5 text-2xl font-semibold text-white">Nenhum card para revisar agora</h3>
            <p className="mt-2 text-slate-300">Cards marcados para o futuro não aparecem na revisão até vencerem.</p>
          </div>
        )}
        {study.view === "browse" && (
          <Browse
            cards={study.filteredCards}
            progress={study.progress}
            markedCardIds={study.markedCardIds}
            cardNotes={study.cardNotes}
            showMarkedOnly={study.showMarkedOnly}
            setShowMarkedOnly={study.setShowMarkedOnly}
            showNotedOnly={study.showNotedOnly}
            setShowNotedOnly={study.setShowNotedOnly}
            query={study.query}
            setQuery={study.setQuery}
            onBack={study.returnToPreviousView}
            reviewCard={study.reviewSpecificCard}
            resetCard={study.resetCard}
            resetCards={study.resetCards}
            saveNote={study.saveCardNote}
            toggleMarked={study.toggleMarkedCard}
          />
        )}
        {study.view === "history" && (
          <History cards={study.historyCards} onBack={study.returnToPreviousView} reviewCard={study.reviewSpecificCard} />
        )}
        {study.view === "settings" && (
          <Settings
            importText={study.importText}
            setImportText={study.setImportText}
            onBack={study.returnToPreviousView}
            exportToClipboard={study.exportToClipboard}
            applyImport={study.applyImport}
            resetAll={study.resetAll}
          />
        )}
      </AppShell>
      {updateReady && <Update onConfirm={onConfirmUpdate} onDismiss={onDismissUpdate} />}
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
