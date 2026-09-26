"use client";

import { useState } from "react";
import { LoginPage } from "@/components/Auth/LoginPage";
import { KanbanBoard } from "@/components/Board/KanbanBoard";
import { AppHeader } from "@/components/Layout/AppHeader";
import type { User } from "@/types/auth";

export function KanbanApp() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <main className="flex flex-1 flex-col">
      <AppHeader user={user} onLogout={() => setUser(null)} />
      <KanbanBoard />
    </main>
  );
}
