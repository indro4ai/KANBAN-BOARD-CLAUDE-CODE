const columnColors: Record<string, string> = {
  backlog: "#888888",
  todo: "#209dd7",
  "in-progress": "#ecad0a",
  review: "#753991",
  done: "#16a34a",
};

export function getColumnColor(columnId: string): string {
  return columnColors[columnId] ?? "#209dd7";
}
