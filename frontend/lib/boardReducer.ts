import type { BoardState, Card } from "@/types/board";

export type BoardAction =
  | { type: "addCard"; columnId: string; card: Card }
  | { type: "deleteCard"; cardId: string }
  | { type: "moveCard"; cardId: string; toColumnId: string; toIndex: number }
  | { type: "renameColumn"; columnId: string; title: string }
  | { type: "restoreBoard"; board: BoardState };

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "addCard":
      return {
        columns: state.columns.map((column) =>
          column.id === action.columnId
            ? { ...column, cardIds: [...column.cardIds, action.card.id] }
            : column
        ),
        cards: { ...state.cards, [action.card.id]: action.card },
      };

    case "deleteCard": {
      const remainingCards = { ...state.cards };
      delete remainingCards[action.cardId];
      return {
        columns: state.columns.map((column) => ({
          ...column,
          cardIds: column.cardIds.filter((id) => id !== action.cardId),
        })),
        cards: remainingCards,
      };
    }

    case "moveCard": {
      if (!state.columns.some((column) => column.id === action.toColumnId)) {
        return state;
      }
      const columnsWithoutCard = state.columns.map((column) => ({
        ...column,
        cardIds: column.cardIds.filter((id) => id !== action.cardId),
      }));
      return {
        ...state,
        columns: columnsWithoutCard.map((column) => {
          if (column.id !== action.toColumnId) return column;
          const index = Math.max(0, Math.min(action.toIndex, column.cardIds.length));
          const cardIds = [...column.cardIds];
          cardIds.splice(index, 0, action.cardId);
          return { ...column, cardIds };
        }),
      };
    }

    case "renameColumn":
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === action.columnId ? { ...column, title: action.title } : column
        ),
      };

    case "restoreBoard":
      return action.board;
  }
}

export function createCardId(): string {
  return `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
