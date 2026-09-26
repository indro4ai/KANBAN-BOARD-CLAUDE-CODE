import type { User } from "@/types/auth";

// Demo-only sign in: credentials are checked in the browser, so this gates the UI but is not real security.
export const DEMO_CREDENTIALS = {
  email: "demo@kanban.dev",
  password: "kanban123",
} as const;

const DEMO_USER: User = {
  name: "Alex Morgan",
  email: DEMO_CREDENTIALS.email,
};

export function authenticate(email: string, password: string): User | null {
  const isValid =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password;
  return isValid ? DEMO_USER : null;
}
