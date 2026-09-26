"use client";

import { useState, type FormEvent } from "react";
import { LayoutGrid } from "lucide-react";
import { authenticate, DEMO_CREDENTIALS } from "@/lib/auth";
import type { User } from "@/types/auth";

type LoginPageProps = {
  onLogin: (user: User) => void;
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 aria-invalid:border-red-500";

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    const user = authenticate(email, password);
    if (!user) {
      setError("Incorrect email or password.");
      return;
    }
    onLogin(user);
  }

  function clearError(): void {
    if (error) setError("");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-navy text-white">
            <LayoutGrid className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Sign in to Project Board</h1>
          <p className="mt-1 text-sm text-muted">Track work from idea to done.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-slate-200 border-t-4 border-t-accent bg-white p-6 shadow-sm"
        >
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError();
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            className={inputClassName}
          />

          <label htmlFor="login-password" className="mt-4 mb-1.5 block text-sm font-medium text-navy">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError();
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            className={inputClassName}
          />

          {error && (
            <p id="login-error" role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-white hover:bg-secondary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Sign in
          </button>
        </form>

        <section
          aria-label="Demo account"
          className="mt-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-navy"
        >
          <p className="font-medium">Demo account</p>
          <p className="mt-1 text-slate-600">
            Email: <span className="font-mono">{DEMO_CREDENTIALS.email}</span>
          </p>
          <p className="text-slate-600">
            Password: <span className="font-mono">{DEMO_CREDENTIALS.password}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
