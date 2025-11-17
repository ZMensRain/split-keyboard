import type { useInputsStore } from "../helpers/hooks/useInputStore";

export type Action = {
  name: string;
  description: string;
  handler: (
    payload: unknown,
    store: typeof useInputsStore,
    handleCommand: (command: string) => void
  ) => void;
};

export function isAction(action: unknown): action is Action {
  if (typeof action !== "object") return false;
  if (action == null) return false;
  if ("name" in action === false) return false;
  if ("description" in action === false) return false;
  if ("handler" in action === false) return false;

  if (typeof action.name !== "string") return false;
  if (typeof action.description !== "string") return false;
  if (typeof action.handler !== "function") return false;

  return true;
}

export type ActionProducer = {
  name: string;
  /// () => Action;
  producer: string;
};

export type Actions = {
  [key: string]: Action;
};
