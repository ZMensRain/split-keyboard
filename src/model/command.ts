import type { NavigateFunction } from "react-router";
import type { useInputsStore } from "../helpers/hooks/useInputStore";

export type Command = {
  names: string[];
  description: string;
  handler: (
    store: typeof useInputsStore,
    commandParts: string[],
    navigate: NavigateFunction
  ) => void;
};

export type CommandProducer = {
  names: string[];
  /// () => Command;
  producer: string;
};

export function isCommand(command: unknown): command is Command {
  if (typeof command !== "object") return false;
  if (command === null) return false;
  if ("names" in command === false) return false;
  if ("description" in command === false) return false;
  if ("handler" in command === false) return false;

  if (typeof command.names !== "object") return false;
  if (typeof command.description !== "string") return false;
  if (typeof command.handler !== "function") return false;

  return true;
}
