"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { CSSProperties } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/Card/TaskCard";
import { ColumnTitle } from "@/components/Column/ColumnTitle";
import { getColumnColor } from "@/lib/columnColors";
import type { Card, Column } from "@/types/board";

type KanbanColumnProps = {
  column: Column;
  cards: Card[];
  isDropTarget: boolean;
  landedCardId: string | null;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string) => void;
  onEditCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function KanbanColumn({
  column,
  cards,
  isDropTarget,
  landedCardId,
  onRename,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <section
      aria-label={column.title}
      data-testid="kanban-column"
      // Exposed as a CSS variable so cards inside can pick up the column colour.
      style={{ "--column-color": getColumnColor(column.id) } as CSSProperties}
      className={`flex w-[85vw] max-w-80 shrink-0 snap-start flex-col rounded-xl border border-t-4 border-t-(--column-color) transition-colors sm:w-72 lg:w-auto lg:max-w-none lg:shrink ${
        isDropTarget
          ? "border-(--column-color) bg-[color-mix(in_srgb,var(--column-color)_8%,white)]"
          : "border-x-transparent border-b-transparent bg-surface"
      }`}
    >
      <header className="flex items-center gap-1.5 px-3 pt-3 pb-2">
        <span className="size-2.5 shrink-0 rounded-full bg-(--column-color)" aria-hidden="true" />
        <ColumnTitle
          columnId={column.id}
          title={column.title}
          onRename={(title) => onRename(column.id, title)}
        />
        <span className="relative ml-auto shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-muted">
          {cards.length}
          <span className="sr-only"> {cards.length === 1 ? "card" : "cards"}</span>
        </span>
      </header>

      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-2 px-3 pb-2">
          {cards.map((card) => (
            <TaskCard
              key={card.id}
              card={card}
              isLanded={card.id === landedCardId}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
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
