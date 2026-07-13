import { Agentation } from "agentation";
import { AppShell } from "./components/AppShell";
import { useStudySession } from "./hooks/useStudySession";
import { Browse } from "./panels/Browse";
import { Card } from "./panels/Card";
import { Dashboard } from "./panels/Dashboard";
import { History } from "./panels/History";
import { Settings } from "./panels/Settings";
import { Simulation } from "./panels/Simulation";
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
          <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-center gap-3 px-5 py-10">
            <div className="rounded-lg border border-cockpit-accent bg-cockpit-accent/10 px-4 py-6 text-center text-sm tracking-[0.14em] text-cockpit-accent">
              ✓ REVISÃO COMPLETA
            </div>
            <div className="flex justify-between rounded-md border border-cockpit-line bg-cockpit-panel px-3 py-3 text-[10px] tracking-[0.08em] text-cockpit-soft">
              <span>CARDS DEVIDOS RESTANTES</span><b className="text-cockpit-bright">0</b>
            </div>
            <div className="flex justify-between rounded-md border border-cockpit-line bg-cockpit-panel px-3 py-3 text-[10px] tracking-[0.08em] text-cockpit-soft">
              <span>STATUS</span><b className="text-cockpit-bright">EM DIA</b>
            </div>
            <button className="mt-2 rounded-md border border-cockpit-line px-3 py-3 text-[11px] tracking-[0.12em] text-cockpit-text transition hover:border-cockpit-muted hover:bg-cockpit-panel" onClick={() => study.setView("dashboard")} type="button">
              RETORNAR AO PAINEL
            </button>
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
            reviewCard={study.reviewSpecificCard}
            resetCard={study.resetCard}
            resetCards={study.resetCards}
            saveNote={study.saveCardNote}
            toggleMarked={study.toggleMarkedCard}
          />
        )}
        {study.view === "history" && (
          <History cards={study.historyCards} progress={study.progress} reviewCard={study.reviewSpecificCard} />
        )}
        {study.view === "simulation" && <Simulation />}
        {study.view === "settings" && (
          <Settings
            importText={study.importText}
            setImportText={study.setImportText}
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
