import { KanbanBoard } from "@/components/Board/KanbanBoard";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
          <div className="mb-3 h-1 w-10 rounded-full bg-accent" aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Project Board</h1>
          <p className="mt-1 text-sm text-muted">
            Track work from idea to done. Drag cards between columns to update their status.
          </p>
        </div>
      </header>
      <KanbanBoard />
    </main>
  );
}
