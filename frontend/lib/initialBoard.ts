import type { BoardState } from "@/types/board";

export const initialBoard: BoardState = {
  columns: [
    { id: "backlog", title: "Backlog", cardIds: ["card-1", "card-2", "card-3"] },
    { id: "todo", title: "To Do", cardIds: ["card-4", "card-5"] },
    { id: "in-progress", title: "In Progress", cardIds: ["card-6", "card-7"] },
    { id: "review", title: "Review", cardIds: ["card-8"] },
    { id: "done", title: "Done", cardIds: ["card-9", "card-10"] },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "Research competitor onboarding",
      details: "Review sign-up flows of three competing products and note the strongest patterns.",
    },
    "card-2": {
      id: "card-2",
      title: "Draft Q4 roadmap",
      details: "Outline the key themes and milestones for the next quarter.",
    },
    "card-3": {
      id: "card-3",
      title: "Collect customer feedback",
      details: "Summarise recurring requests from the latest support tickets.",
    },
    "card-4": {
      id: "card-4",
      title: "Design settings page",
      details: "Create wireframes for account and notification settings.",
    },
    "card-5": {
      id: "card-5",
      title: "Set up error monitoring",
      details: "Configure alerts for failed payments and API timeouts.",
    },
    "card-6": {
      id: "card-6",
      title: "Build pricing page",
      details: "Implement the responsive pricing table with monthly and annual plans.",
    },
    "card-7": {
      id: "card-7",
      title: "Write release notes",
      details: "Document the changes shipping in version 2.4.",
    },
    "card-8": {
      id: "card-8",
      title: "Review checkout flow",
      details: "Verify copy, validation messages and edge cases before launch.",
    },
    "card-9": {
      id: "card-9",
      title: "Launch marketing site",
      details: "New landing page is live with updated messaging.",
    },
    "card-10": {
      id: "card-10",
      title: "Migrate design tokens",
      details: "Colours and spacing now come from a single shared source.",
    },
  },
};
