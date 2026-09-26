"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CardDialog } from "@/components/Card/CardDialog";
import { TaskCardPreview } from "@/components/Card/TaskCard";
import { KanbanColumn } from "@/components/Column/KanbanColumn";
import { boardReducer, createCardId } from "@/lib/boardReducer";
import { getColumnColor } from "@/lib/columnColors";
import { initialBoard } from "@/lib/initialBoard";
import type { BoardState } from "@/types/board";

type OpenDialog = { mode: "add"; columnId: string } | { mode: "edit"; cardId: string } | null;

export function KanbanBoard() {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  // Cards move between columns while hovering, so keep the pre-drag board to restore on cancel.
  const boardBeforeDrag = useRef<BoardState | null>(null);
  const [landedCardId, setLandedCardId] = useState<string | null>(null);

  // Clear the highlight once the landing animation has played so it can replay on the next move.
  useEffect(() => {
    if (!landedCardId) return;
    const timeout = setTimeout(() => setLandedCardId(null), 1000);
    return () => clearTimeout(timeout);
  }, [landedCardId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function findColumnId(id: UniqueIdentifier): string | undefined {
    const column = board.columns.find(
      (candidate) => candidate.id === id || candidate.cardIds.includes(String(id))
    );
    return column?.id;
  }

  function columnTitle(id: UniqueIdentifier | undefined): string {
    const columnId = id === undefined ? undefined : findColumnId(id);
    return board.columns.find((column) => column.id === columnId)?.title ?? "the board";
  }

  function cardTitle(id: UniqueIdentifier): string {
    return board.cards[String(id)]?.title ?? "card";
  }

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${cardTitle(active.id)} in ${columnTitle(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `${cardTitle(active.id)} is over ${columnTitle(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${cardTitle(active.id)} was dropped in ${columnTitle(over.id)}.`
        : `${cardTitle(active.id)} was dropped.`,
    onDragCancel: ({ active }) =>
      `Moving ${cardTitle(active.id)} was cancelled. It is back in its original position.`,
  };

  function handleDragStart({ active }: DragStartEvent): void {
    boardBeforeDrag.current = board;
    setActiveCardId(String(active.id));
  }

  function handleDragOver({ active, over }: DragOverEvent): void {
    if (!over) return;
    const fromColumnId = findColumnId(active.id);
    const toColumnId = findColumnId(over.id);
    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;

    const targetCardIds = board.columns.find((column) => column.id === toColumnId)!.cardIds;
    const overIndex = targetCardIds.indexOf(String(over.id));
    let toIndex = targetCardIds.length;
    if (overIndex >= 0) {
      const activeTop = active.rect.current.translated?.top ?? 0;
      const isBelowOverCard = activeTop > over.rect.top + over.rect.height / 2;
      toIndex = overIndex + (isBelowOverCard ? 1 : 0);
    }
    dispatch({ type: "moveCard", cardId: String(active.id), toColumnId, toIndex });
  }

  function handleDragEnd({ active, over }: DragEndEvent): void {
    const startColumnId = boardBeforeDrag.current?.columns.find((column) =>
      column.cardIds.includes(String(active.id))
    )?.id;
    setActiveCardId(null);
    boardBeforeDrag.current = null;
    if (!over) return;

    const toColumnId = findColumnId(over.id);
    if (!toColumnId) return;
    if (toColumnId !== startColumnId) setLandedCardId(String(active.id));
    const targetCardIds = board.columns.find((column) => column.id === toColumnId)!.cardIds;
    const overIndex = targetCardIds.indexOf(String(over.id));
    const toIndex = overIndex >= 0 ? overIndex : targetCardIds.length;
    dispatch({ type: "moveCard", cardId: String(active.id), toColumnId, toIndex });
  }

  function handleDragCancel(): void {
    if (boardBeforeDrag.current) {
      dispatch({ type: "restoreBoard", board: boardBeforeDrag.current });
    }
    boardBeforeDrag.current = null;
    setActiveCardId(null);
  }

  function saveCard(title: string, details: string): void {
    if (openDialog?.mode === "add") {
      dispatch({
        type: "addCard",
        columnId: openDialog.columnId,
        card: { id: createCardId(), title, details },
      });
    } else if (openDialog?.mode === "edit") {
      dispatch({ type: "updateCard", cardId: openDialog.cardId, title, details });
    }
    setOpenDialog(null);
  }

  function renderCardDialog() {
    if (openDialog?.mode === "add") {
      const column = board.columns.find((candidate) => candidate.id === openDialog.columnId);
      if (!column) return null;
      return (
        <CardDialog
          heading="Add card"
          description={`To column: ${column.title}`}
          submitLabel="Add card"
          onSubmit={saveCard}
          onClose={() => setOpenDialog(null)}
        />
      );
    }
    if (openDialog?.mode === "edit") {
      const card = board.cards[openDialog.cardId];
      if (!card) return null;
      return (
        <CardDialog
          heading="Edit card"
          description={`In column: ${columnTitle(card.id)}`}
          submitLabel="Save changes"
          initialTitle={card.title}
          initialDetails={card.details}
          onSubmit={saveCard}
          onClose={() => setOpenDialog(null)}
        />
      );
    }
    return null;
  }

  const activeCard = activeCardId ? board.cards[activeCardId] : null;
  const dropTargetColumnId = activeCardId ? findColumnId(activeCardId) : undefined;

  return (
    <>
      <DndContext
        id="kanban-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        accessibility={{ announcements }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-6 sm:px-8 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={column.cardIds.map((cardId) => board.cards[cardId])}
              isDropTarget={column.id === dropTargetColumnId}
              landedCardId={landedCardId}
              onRename={(columnId, title) => dispatch({ type: "renameColumn", columnId, title })}
              onAddCard={(columnId) => setOpenDialog({ mode: "add", columnId })}
              onEditCard={(cardId) => setOpenDialog({ mode: "edit", cardId })}
              onDeleteCard={(cardId) => dispatch({ type: "deleteCard", cardId })}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <TaskCardPreview
              card={activeCard}
              color={getColumnColor(dropTargetColumnId ?? "")}
            />
          )}
        </DragOverlay>
      </DndContext>

      {renderCardDialog()}
    </>
  );
}
