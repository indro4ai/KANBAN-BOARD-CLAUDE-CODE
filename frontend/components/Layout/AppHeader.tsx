import { LogOut } from "lucide-react";
import type { User } from "@/types/auth";

type AppHeaderProps = {
  user: User;
  onLogout: () => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-start justify-between gap-4 px-4 py-6 sm:px-8">
        <div className="min-w-0">
          <div className="mb-3 h-1 w-10 rounded-full bg-accent" aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Project Board</h1>
          <p className="mt-1 text-sm text-muted">
            Track work from idea to done. Drag cards between columns to update their status.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-4">
          <div className="hidden items-center gap-2.5 sm:flex">
            <span
              className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
              aria-hidden="true"
            >
              {getInitials(user.name)}
            </span>
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-navy">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
