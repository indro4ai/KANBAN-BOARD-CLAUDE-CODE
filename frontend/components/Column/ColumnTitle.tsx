"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Pencil } from "lucide-react";

type ColumnTitleProps = {
  columnId: string;
  title: string;
  onRename: (title: string) => void;
};

export function ColumnTitle({ columnId, title, onRename }: ColumnTitleProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftTitle, setDraftTitle] = useState<string>(title);
  const [error, setError] = useState<string>("");

  const inputId = `column-title-${columnId}`;
  const errorId = `${inputId}-error`;

  function startEditing(): void {
    setDraftTitle(title);
    setError("");
    setIsEditing(true);
  }

  function cancelEditing(): void {
    setError("");
    setIsEditing(false);
  }

  function saveTitle(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      setError("Column name cannot be empty.");
      return;
    }
    onRename(trimmedTitle);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") cancelEditing();
  }

  if (!isEditing) {
    return (
      <div className="flex min-w-0 items-center gap-1">
        <h2
          onDoubleClick={startEditing}
          className="truncate px-1 text-sm font-semibold tracking-wide text-navy uppercase"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Rename column: ${title}`}
          className="shrink-0 rounded p-1 text-slate-400 hover:bg-white hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={saveTitle} className="min-w-0 flex-1" noValidate>
      <label htmlFor={inputId} className="sr-only">
        Column name
      </label>
      <input
        id={inputId}
        type="text"
        value={draftTitle}
        maxLength={40}
        autoFocus
        onFocus={(event) => event.target.select()}
        onChange={(event) => {
          setDraftTitle(event.target.value);
          if (error) setError("");
        }}
        onKeyDown={handleKeyDown}
        // Leaving the field with an invalid name reverts rather than trapping the user.
        onBlur={(event) => {
          if (draftTitle.trim()) event.currentTarget.form?.requestSubmit();
          else cancelEditing();
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-md border border-primary bg-white px-2 py-1 text-sm font-semibold text-navy outline-none focus:ring-2 focus:ring-primary/30 aria-invalid:border-red-500"
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
