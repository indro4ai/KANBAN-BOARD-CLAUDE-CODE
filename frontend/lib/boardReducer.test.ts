import { describe, expect, it } from "vitest";
import { boardReducer, createCardId } from "@/lib/boardReducer";
import { initialBoard } from "@/lib/initialBoard";
import type { BoardState } from "@/types/board";

function cardIdsOf(board: BoardState, columnId: string): string[] {
  return board.columns.find((column) => column.id === columnId)!.cardIds;
}

describe("initialBoard", () => {
  it("has five columns and every referenced card exists", () => {
    expect(initialBoard.columns).toHaveLength(5);
    const referencedIds = initialBoard.columns.flatMap((column) => column.cardIds);
    expect(referencedIds.length).toBeGreaterThan(0);
    for (const id of referencedIds) expect(initialBoard.cards[id]).toBeDefined();
  });
});

describe("boardReducer", () => {
  it("adds a card to the end of a column", () => {
    const card = { id: "new", title: "New task", details: "Some details" };
    const next = boardReducer(initialBoard, { type: "addCard", columnId: "review", card });
    expect(cardIdsOf(next, "review")).toEqual(["card-8", "new"]);
    expect(next.cards.new).toEqual(card);
  });

  it("deletes a card from its column and the card map", () => {
    const next = boardReducer(initialBoard, { type: "deleteCard", cardId: "card-4" });
    expect(cardIdsOf(next, "todo")).toEqual(["card-5"]);
    expect(next.cards["card-4"]).toBeUndefined();
  });

  it("moves a card to another column at the given index", () => {
    const next = boardReducer(initialBoard, {
      type: "moveCard",
      cardId: "card-1",
      toColumnId: "done",
      toIndex: 1,
    });
    expect(cardIdsOf(next, "backlog")).toEqual(["card-2", "card-3"]);
    expect(cardIdsOf(next, "done")).toEqual(["card-9", "card-1", "card-10"]);
  });

  it("reorders a card within the same column", () => {
    const next = boardReducer(initialBoard, {
      type: "moveCard",
      cardId: "card-1",
      toColumnId: "backlog",
      toIndex: 2,
    });
    expect(cardIdsOf(next, "backlog")).toEqual(["card-2", "card-3", "card-1"]);
  });

  it("clamps an out-of-range index to the end of the column", () => {
    const next = boardReducer(initialBoard, {
      type: "moveCard",
      cardId: "card-1",
      toColumnId: "review",
      toIndex: 99,
    });
    expect(cardIdsOf(next, "review")).toEqual(["card-8", "card-1"]);
  });

  it("ignores moves to an unknown column", () => {
    const next = boardReducer(initialBoard, {
      type: "moveCard",
      cardId: "card-1",
      toColumnId: "missing",
      toIndex: 0,
    });
    expect(next).toBe(initialBoard);
  });

  it("renames a column", () => {
    const next = boardReducer(initialBoard, {
      type: "renameColumn",
      columnId: "todo",
      title: "Up Next",
    });
    expect(next.columns.find((column) => column.id === "todo")!.title).toBe("Up Next");
  });

  it("restores a previous board", () => {
    const moved = boardReducer(initialBoard, { type: "deleteCard", cardId: "card-1" });
    expect(boardReducer(moved, { type: "restoreBoard", board: initialBoard })).toBe(initialBoard);
  });

  it("does not mutate the previous state", () => {
    const snapshot = structuredClone(initialBoard);
    boardReducer(initialBoard, { type: "moveCard", cardId: "card-1", toColumnId: "done", toIndex: 0 });
    boardReducer(initialBoard, { type: "deleteCard", cardId: "card-2" });
    boardReducer(initialBoard, { type: "renameColumn", columnId: "backlog", title: "Ideas" });
    expect(initialBoard).toEqual(snapshot);
  });
});

describe("createCardId", () => {
  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => createCardId()));
    expect(ids.size).toBe(100);
  });
});
