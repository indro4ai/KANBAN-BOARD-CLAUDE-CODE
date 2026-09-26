"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Card } from "@/types/board";

type TaskCardProps = {
  card: Card;
  isLanded: boolean;
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
};

const cardActionClassName =
  "rounded p-1 text-slate-500 focus-visible:outline-2 focus-visible:outline-primary";

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

export function TaskCard({ card, isLanded, onEdit, onDelete }: TaskCardProps) {
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
      className={`${cardClassName} relative cursor-grab touch-none hover:border-slate-300 ${
        isDragging
          ? "border-dashed border-(--column-color)! bg-[color-mix(in_srgb,var(--column-color)_10%,white)] opacity-60"
          : ""
      } ${isLanded ? "animate-card-landed" : ""}`}
      data-testid="task-card"
      data-landed={isLanded || undefined}
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
        {/* Stop pointer events so clicking an action never starts a drag. */}
        <div
          onPointerDown={(event) => event.stopPropagation()}
          className="-mr-1 flex shrink-0 gap-0.5 rounded-md bg-white transition-opacity focus-within:opacity-100 sm:absolute sm:top-2 sm:right-3 sm:mr-0 sm:opacity-0 sm:shadow-sm sm:ring-1 sm:ring-slate-200 sm:group-hover:opacity-100"
        >
          <button
            type="button"
            onClick={() => onEdit(card.id)}
            aria-label={`Edit card: ${card.title}`}
            className={`${cardActionClassName} hover:bg-slate-100 hover:text-navy`}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(card.id)}
            aria-label={`Delete card: ${card.title}`}
            className={`${cardActionClassName} hover:bg-red-50 hover:text-red-600`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

type TaskCardPreviewProps = {
  card: Card;
  color: string;
};

export function TaskCardPreview({ card, color }: TaskCardPreviewProps) {
  return (
    <div
      style={{ "--column-color": color } as CSSProperties}
      className={`${cardClassName} cursor-grabbing border-(--column-color)! shadow-lg`}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="-ml-1 mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <TaskCardText card={card} />
      </div>
    </div>
  );
}
