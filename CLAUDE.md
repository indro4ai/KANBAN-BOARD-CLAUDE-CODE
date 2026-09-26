# AGENT.md

# Kanban Board MVP

This document defines the requirements, technical direction, design system, implementation strategy, and coding standards for the Kanban Board project.

The coding agent must read and follow this file before making changes.

---

## 1. Business Requirement

Build an MVP of a Kanban-style Project Management web application.

### Core Requirements

- The web app should have exactly **one board**.
- The board should contain exactly **five columns**.
- The five columns should have default names and allow the user to rename them.
- Each card should contain only:
  - Title
  - Details
- Users should be able to drag and drop cards between columns.
- Users should be able to add a new card to any column.
- Users should be able to delete an existing card.
- The application should open with useful dummy/sample data already populated.
- The application should have a polished, professional, modern UI/UX.
- Keep the MVP intentionally simple.

### Explicitly Out of Scope

Do NOT add functionality that is not required for the MVP.

The following are intentionally excluded:

- Multiple boards
- User authentication
- User management
- Archive functionality
- Search
- Filtering
- Priorities
- Due dates
- Labels/tags
- Comments
- Notifications
- Analytics
- Backend database
- Cloud persistence
- Unrequested integrations

The goal is a focused Kanban board, not a full project-management platform.

---

## 2. Technical Details

### Application Architecture

- Build the application as a modern **Next.js** web application.
- The Next.js application must be created inside a subdirectory named:

```text
frontend
```

- The application should be primarily client-rendered because the MVP does not require server-side data management.
- Use **Node.js only** for application development and runtime.
- Do not introduce another backend runtime such as Python, Java, Go, or PHP.
- If Python is ever required for a supporting development script or tooling task, use **uv** for Python environment and dependency management.
- Never use `pip` for Python dependency installation.

### Recommended Stack

Use current, stable, popular libraries that fit naturally with Next.js.

Preferred technologies:

- Node.js
- Next.js
- TypeScript
- React
- Tailwind CSS
- A maintained drag-and-drop library compatible with React
- Lucide React or another lightweight icon library

Do not add a library unless it provides meaningful value.

### Data

There should be **no persistence** in the MVP.

The board should use in-memory client-side state.

When the browser is refreshed, the application may return to the original dummy data.

Do not introduce:

- Database
- API server
- Authentication
- localStorage
- Cloud storage

unless explicitly requested later.

### Board Model

Use a simple data model.

Example:

```ts
type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

type Card = {
  id: string;
  title: string;
  details: string;
};
```

Keep the data model minimal.

Do not add fields that are not required by the business requirements.

---

## 3. Colour Scheme

Use a clean, professional colour system based on the following palette.

### Accent Yellow

```text
#ecad0a
```

Use for:

- Accent lines
- Highlights
- Small visual emphasis
- Selected states where appropriate

### Primary Blue

```text
#209dd7
```

Use for:

- Links
- Key sections
- Primary informational elements

### Secondary Purple

```text
#753991
```

Use for:

- Important actions
- Submit buttons
- Secondary emphasis

### Dark Navy

```text
#032147
```

Use for:

- Main headings
- Strong text
- Navigation
- Important UI elements

### Gray Text

```text
#888888
```

Use for:

- Supporting text
- Labels
- Secondary information

### General UI Direction

The interface should feel:

- Modern
- Professional
- Elegant
- Minimal
- Spacious
- Easy to scan

Avoid excessive gradients, decorative effects, large shadows, or unnecessary visual complexity.

Colour must not be the only way to communicate important information.

---

## 4. Strategy

### Phase 1 — Project Scaffolding

Create the project structure first.

Success criteria:

- `frontend` directory exists.
- Next.js application is configured.
- TypeScript is enabled.
- Styling system is configured.
- `.gitignore` is present.
- The project starts successfully with Node.js.
- No unnecessary dependencies are installed.

---

### Phase 2 — Board UI

Build the single Kanban board.

Success criteria:

- Exactly five columns are displayed.
- Columns have clear headings.
- Columns can be renamed.
- Dummy cards are displayed.
- Layout looks polished on desktop and mobile.
- Empty columns are handled cleanly.

---

### Phase 3 — Card Management

Implement card operations.

Success criteria:

- User can add a card.
- User can enter title and details.
- User can delete a card.
- User can view the card title and details.
- Empty titles are rejected.
- The UI updates immediately after changes.

---

### Phase 4 — Drag and Drop

Implement card movement.

Success criteria:

- Cards can be dragged.
- Cards can be dropped into another column.
- Cards can be reordered where supported.
- The UI clearly indicates the drag/drop target.
- Card state is updated correctly after dropping.

---

### Phase 5 — Polish

Refine the interface.

Success criteria:

- Consistent spacing.
- Consistent typography.
- Responsive layout.
- Clear hover and focus states.
- Professional buttons and controls.
- Appropriate empty states.
- No unnecessary animations.

---

### Phase 6 — Testing

Perform thorough testing before considering the MVP complete.

Use unit testing where appropriate and browser-level integration testing with **Playwright** or a similar established tool.

Verify at minimum:

1. Application starts successfully.
2. Board displays five columns.
3. Columns can be renamed.
4. Dummy cards are displayed.
5. A new card can be created.
6. A card can be deleted.
7. Cards can move between columns.
8. Card title and details work correctly.
9. Empty/invalid card input is handled.
10. Responsive layout works.
11. No critical console errors occur.
12. Existing functionality is not broken by later changes.

---

### Completion Criteria

Do not consider the project complete until:

- The MVP requirements are implemented.
- All major user flows have been tested.
- Integration testing has been completed.
- Known defects introduced during development have been fixed.
- The application is running successfully.
- The final project is ready for the user to run locally.

---

## 5. Coding Standards

### 5.1 Keep It Simple

The most important coding principle is:

> Keep the implementation as simple as possible while delivering an elegant user experience.

Never over-engineer the MVP.

Do not create abstractions without a clear need.

Do not build future functionality before it is requested.

---

### 5.2 Use Current Libraries

Use current stable versions of the selected libraries and idiomatic approaches for the current ecosystem.

Before introducing a dependency:

1. Check whether the functionality can be implemented with the existing stack.
2. Prefer established libraries.
3. Avoid duplicate functionality.
4. Keep the dependency footprint small.

---

### 5.3 TypeScript Standards

Use TypeScript throughout the application.

Avoid `any` unless there is a documented and unavoidable reason.

Prefer explicit types for:

- Props
- State models
- Functions
- Event handlers
- Data structures

---

### 5.4 React Standards

Create small, focused components.

Prefer a structure such as:

```text
frontend/
├── app/
├── components/
│   ├── Board/
│   ├── Column/
│   ├── Card/
│   └── UI/
├── lib/
├── types/
└── public/
```

Do not create one huge component containing the entire application.

---

### 5.5 State Management

Use simple React state for the MVP.

Prefer:

- `useState`
- `useReducer` when state transitions become complex

Do not introduce Redux, Zustand, or another global state library unless the project genuinely requires it.

There is only one board, so global state management should not be necessary.

---

### 5.6 Naming

Use descriptive names.

Components:

```text
KanbanBoard
KanbanColumn
TaskCard
AddCardDialog
RenameColumnDialog
```

Functions:

```text
addCard()
deleteCard()
moveCard()
renameColumn()
```

Avoid vague names such as:

```text
data()
handleThing()
process()
temp()
```

---

### 5.7 State Mutation

Never directly mutate React state.

Prefer immutable updates.

Example:

```ts
setColumns((currentColumns) =>
  currentColumns.map((column) =>
    column.id === columnId
      ? { ...column, title: newTitle }
      : column
  )
);
```

---

### 5.8 Accessibility

The application must be accessible by default.

Ensure:

- Buttons have meaningful labels.
- Form fields have labels.
- Keyboard navigation works.
- Focus states are visible.
- Dialogs can be closed appropriately.
- Interactive elements use semantic HTML where possible.
- Drag-and-drop functionality has a reasonable accessible interaction where the selected library supports it.

---

### 5.9 Error Handling

Handle expected user errors gracefully.

Examples:

- Empty card title.
- Empty column name.
- Invalid form submission.

Show clear user-friendly feedback.

Do not expose raw technical errors to the user.

---

### 5.10 Comments

Keep comments minimal.

Comments should explain **why**, not simply repeat what the code does.

Avoid unnecessary comments throughout straightforward code.

---

### 5.11 README

Keep the README concise.

It should contain only the essential information required to:

1. Install dependencies.
2. Start the application.
3. Run tests.

Do not create a large documentation system for this MVP.

---

### 5.12 No Emojis

Do not use emojis in:

- Source code comments
- README
- UI text
- Error messages
- Commit messages
- Agent-generated documentation

Keep communication professional and concise.

---

## 6. Agent Rules

Before making changes:

1. Read `AGENT.md`.
2. Inspect the existing project structure.
3. Understand the current implementation.
4. Make the smallest reasonable change.
5. Follow the requirements in this document.
6. Run relevant tests after changes.
7. Fix errors caused by the implementation.
8. Do not add unrequested features.
9. Do not replace working code unnecessarily.
10. Keep the project simple.

When a requirement is ambiguous, prefer the simplest implementation that satisfies the stated business requirement.

The final implementation should be a **small, polished, well-tested Kanban MVP**, not a full project-management system.
