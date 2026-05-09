import { Header } from "../panels/Header";
import { Stats } from "../panels/Stats";
import type { SubjectFilter, View } from "../appTypes";
import type { StudyStats } from "../studyStats";

type AppShellProps = {
  view: View;
  onViewChange: (view: View) => void;
  subject: SubjectFilter;
  onSubjectChange: (subject: SubjectFilter) => void;
  stats: StudyStats;
  markedCount: number;
  onOpenMarked: () => void;
  children: React.ReactNode;
};

export function AppShell({ view, onViewChange, subject, onSubjectChange, stats, markedCount, onOpenMarked, children }: AppShellProps) {
  const isReviewing = view === "review";

  return (
    <div className="min-h-screen text-slate-100">
      <Header view={view} onViewChange={onViewChange} />

      <main className={`mx-auto grid max-w-7xl gap-5 px-4 py-5 ${isReviewing ? "" : "lg:grid-cols-[18rem_1fr]"}`}>
        {!isReviewing && (
          <Stats subject={subject} onSubjectChange={onSubjectChange} stats={stats} markedCount={markedCount} onOpenMarked={onOpenMarked} />
        )}

        <section>{children}</section>
      </main>
    </div>
  );
}
