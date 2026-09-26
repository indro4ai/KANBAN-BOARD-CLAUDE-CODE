"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/Card/TaskCard";
import { ColumnTitle } from "@/components/Column/ColumnTitle";
import type { Card, Column } from "@/types/board";

type KanbanColumnProps = {
  column: Column;
  cards: Card[];
  isDropTarget: boolean;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function KanbanColumn({
  column,
  cards,
  isDropTarget,
  onRename,
  onAddCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <section
      aria-label={column.title}
      data-testid="kanban-column"
      className={`flex w-[85vw] max-w-80 shrink-0 snap-start flex-col rounded-xl border bg-surface transition-colors sm:w-72 lg:w-auto lg:max-w-none lg:shrink ${
        isDropTarget ? "border-primary bg-primary/5" : "border-transparent"
      }`}
    >
      <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <ColumnTitle
          columnId={column.id}
          title={column.title}
          onRename={(title) => onRename(column.id, title)}
        />
        <span className="relative shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-muted">
          {cards.length}
          <span className="sr-only"> {cards.length === 1 ? "card" : "cards"}</span>
        </span>
      </header>

      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-2 px-3 pb-2">
          {cards.map((card) => (
            <TaskCard key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
          {cards.length === 0 && (
            <li className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-muted">
              No cards yet. Drop a card here or add one below.
            </li>
          )}
        </ul>
      </SortableContext>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => onAddCard(column.id)}
          className="relative flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-secondary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add card
          <span className="sr-only"> to {column.title}</span>
        </button>
      </div>
    </section>
  );
}
