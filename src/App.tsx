import { Agentation } from "agentation";
import { AppShell } from "./components/AppShell";
import { useStudySession } from "./hooks/useStudySession";
import { Browse } from "./panels/Browse";
import { Dashboard } from "./panels/Dashboard";
import { Review } from "./panels/Review";
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
        onOpenMarked={() => {
          study.setShowMarkedOnly(true);
          study.setView("browse");
        }}
      >
        {study.view === "dashboard" && (
          <Dashboard progress={study.progress} startReview={study.startReview} />
        )}
        {study.view === "review" && study.activeCard && (
          <Review
            card={study.activeCard}
            progress={study.progress[study.activeCard.id]}
            isMarked={study.markedCardIds.has(study.activeCard.id)}
            selectedAnswer={study.selectedAnswer}
            revealed={study.revealed}
            onBack={study.returnFromReview}
            chooseAnswer={study.chooseAnswer}
            gradeAnswer={study.gradeAnswer}
            toggleMarked={() => study.toggleMarkedCard(study.activeCard!.id)}
          />
        )}
        {study.view === "browse" && (
          <Browse
            cards={study.filteredCards}
            progress={study.progress}
            markedCardIds={study.markedCardIds}
            showMarkedOnly={study.showMarkedOnly}
            setShowMarkedOnly={study.setShowMarkedOnly}
            query={study.query}
            setQuery={study.setQuery}
            reviewCard={study.reviewSpecificCard}
            resetCard={study.resetCard}
            toggleMarked={study.toggleMarkedCard}
          />
        )}
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
