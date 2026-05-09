import { Agentation } from "agentation";
import { AppShell } from "./components/AppShell";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { useStudySession } from "./hooks/useStudySession";
import { BrowseView } from "./views/BrowseView";
import { DashboardView } from "./views/DashboardView";
import { ReviewView } from "./views/ReviewView";
import { SettingsView } from "./views/SettingsView";

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
          <DashboardView progress={study.progress} subject={study.subject} startReview={() => study.setView("review")} />
        )}
        {study.view === "review" && study.activeCard && (
          <ReviewView
            card={study.activeCard}
            progress={study.progress[study.activeCard.id]}
            isMarked={study.markedCardIds.has(study.activeCard.id)}
            selectedAnswer={study.selectedAnswer}
            revealed={study.revealed}
            chooseAnswer={study.chooseAnswer}
            gradeAnswer={study.gradeAnswer}
            toggleMarked={() => study.toggleMarkedCard(study.activeCard!.id)}
          />
        )}
        {study.view === "browse" && (
          <BrowseView
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
          <SettingsView
            importText={study.importText}
            setImportText={study.setImportText}
            exportToClipboard={study.exportToClipboard}
            applyImport={study.applyImport}
            resetAll={study.resetAll}
          />
        )}
      </AppShell>
      {updateReady && <UpdatePrompt onConfirm={onConfirmUpdate} onDismiss={onDismissUpdate} />}
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
