"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { Card } from "@/types/board";

type TaskCardProps = {
  card: Card;
  onDelete: (cardId: string) => void;
};

const cardClassName =
  "group rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors";

function TaskCardText({ card }: { card: Card }) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="text-sm font-semibold leading-snug break-words text-navy">{card.title}</h3>
      {card.details && (
        <p className="mt-1 text-sm leading-relaxed break-words whitespace-pre-line text-slate-600">
          {card.details}
        </p>
      )}
    </div>
  );
}

export function TaskCard({ card, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...listeners}
      className={`${cardClassName} cursor-grab touch-none hover:border-slate-300 ${
        isDragging ? "opacity-40" : ""
      }`}
      data-testid="task-card"
    >
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          aria-label={`Move card: ${card.title}`}
          className="-ml-1 mt-px cursor-grab rounded p-0.5 text-slate-400 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <TaskCardText card={card} />
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={`Delete card: ${card.title}`}
          className="-mr-1 rounded p-1 text-slate-400 opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export function TaskCardPreview({ card }: { card: Card }) {
  return (
    <div className={`${cardClassName} cursor-grabbing border-primary shadow-md`}>
      <div className="flex items-start gap-1.5">
        <GripVertical className="-ml-1 mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <TaskCardText card={card} />
      </div>
    </div>
  );
}
