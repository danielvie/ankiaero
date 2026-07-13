import { Header } from "../panels/Header";
import type { View } from "../appTypes";

export function AppShell({
  view,
  onViewChange,
  children
}: {
  view: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent font-sans text-cockpit-text">
      <Header view={view} onViewChange={onViewChange} />
      <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-3xl">{children}</main>
    </div>
  );
}
