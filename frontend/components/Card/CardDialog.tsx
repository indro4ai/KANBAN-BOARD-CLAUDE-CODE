"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { X } from "lucide-react";

type CardDialogProps = {
  heading: string;
  description: string;
  submitLabel: string;
  initialTitle?: string;
  initialDetails?: string;
  onSubmit: (title: string, details: string) => void;
  onClose: () => void;
};

export function CardDialog({
  heading,
  description,
  submitLabel,
  initialTitle = "",
  initialDetails = "",
  onSubmit,
  onClose,
}: CardDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState<string>(initialTitle);
  const [details, setDetails] = useState<string>(initialDetails);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please enter a card title.");
      return;
    }
    onSubmit(trimmedTitle, details.trim());
  }

  // A click whose target is the dialog element itself landed on the backdrop.
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="card-dialog-heading"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-0 text-navy shadow-xl"
    >
      <form onSubmit={handleSubmit} noValidate className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="card-dialog-heading" className="text-lg font-semibold">
              {heading}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <label htmlFor="card-title" className="mb-1.5 block text-sm font-medium">
          Title
        </label>
        <input
          id="card-title"
          type="text"
          value={title}
          maxLength={100}
          autoFocus
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError("");
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "card-title-error" : undefined}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 aria-invalid:border-red-500"
          placeholder="What needs to be done?"
        />
        {error && (
          <p id="card-title-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <label htmlFor="card-details" className="mt-4 mb-1.5 block text-sm font-medium">
          Details <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="card-details"
          value={details}
          rows={4}
          maxLength={1000}
          onChange={(event) => setDetails(event.target.value)}
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          placeholder="Add more context"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
