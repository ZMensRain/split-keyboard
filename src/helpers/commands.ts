import type { NavigateFunction } from "react-router";
import { useInputsStore } from "./hooks/useInputStore";
import { db } from "./db";

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

export const commands: Command[] = [
  {
    names: ["w", "save", "write"],
    description: "Saves the text in the main input to a file",
    handler: (store, commandParts) => {
      if (commandParts.length < 2) return;

      const text = store.getState().inputs["main"].text;

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8, " + encodeURIComponent(text)
      );
      element.setAttribute("download", commandParts[1]);
      document.body.appendChild(element);
      element.click();

      document.body.removeChild(element);
    },
  },
  {
    names: ["exit", "q", "quit"],
    description: "Exits command mode",
    handler: (store) => {
      const state = store.getState();
      state.setActiveName("main");
    },
  },
  {
    names: ["settings"],
    description: "Opens the settings page",
    handler: (_store, commandParts: string[], navigate) => {
      if (commandParts.length == 2) navigate("/settings/" + commandParts[1]);
      else navigate("/settings");
    },
  },
  {
    names: ["layout"],
    description:
      "Switches the active keyboard layout used like 'layout <keyboard layout name>'",
    handler: (store, commandParts: string[]) => {
      if (commandParts.length < 2) return;

      store.setState({ activeLayoutName: commandParts[1] });
    },
  },
  {
    names: ["help"],
    description: "Opens the FAQ page",
    handler: (_store, _commandParts, navigate) => {
      navigate("/FAQ");
    },
  },
];

function GetCommandFromProducer(producer: CommandProducer) {
  let command: unknown;
  try {
    command = eval?.('"use strict"; ' + producer.producer)?.();
  } catch (error) {
    console.error(error, "When eval called on user command producer");
    command = undefined;
  }

  console.log(command);

  // add some runtime protection against invalid actions
  if (!isCommand(command)) return;
  return command;
}

export async function GetCommands(): Promise<Command[]> {
  const output: Command[] = [];
  // Could be a security issue here, but I don't think it's a big deal will add a warning when adding a new action
  const request = await db.UserCommands.toArray();
  request.forEach((commandProducer) => {
    const command = GetCommandFromProducer(commandProducer);
    if (command == undefined) return;

    output.push(command);
  });

  return [...commands, ...output];
}

export async function AddCommand(
  names: string[],
  producer: string
): Promise<boolean> {
  const command = GetCommandFromProducer({ names, producer });
  if (command === undefined) {
    alert("Invalid command producer");
    return false;
  }
  if (command.names.sort().join(",") != names.sort().join(",")) {
    alert("names lists don't match");
    return false;
  }
  db.UserCommands.put({ producer, names: names.sort() });
  return true;
}

export async function DeleteCommand(names: string[]) {
  await db.UserCommands.delete(names.sort());
}

export const handleCommand = (command: string, navigate: NavigateFunction) => {
  const parts = command.split(" ");

  GetCommands().then((commands) => {
    const c = commands.find(
      (command) => command.names.find((v) => v == parts[0]) !== undefined
    );
    c?.handler(useInputsStore, parts, navigate);
    useInputsStore.getState().clear("commandMode");
  });
};
