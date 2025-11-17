import type { NavigateFunction } from "react-router";
import { useInputsStore } from "../hooks/useInputStore";
import { db } from "./db";
import {
  type Command,
  type CommandProducer,
  isCommand,
} from "../../model/command";

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

function getCommandFromProducer(producer: CommandProducer) {
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

export async function getCommands(): Promise<Command[]> {
  const output: Command[] = [];
  // Could be a security issue here, but I don't think it's a big deal will add a warning when adding a new action
  const request = await db.UserCommands.toArray();
  request.forEach((commandProducer) => {
    const command = getCommandFromProducer(commandProducer);
    if (command == undefined) return;

    output.push(command);
  });

  return [...commands, ...output];
}

export async function addCommand(
  names: string[],
  producer: string
): Promise<boolean> {
  const command = getCommandFromProducer({ names, producer });
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

export async function deleteCommand(names: string[]) {
  await db.UserCommands.delete(names.sort());
}

export const handleCommand = (command: string, navigate: NavigateFunction) => {
  const parts = command.split(" ");

  getCommands().then((commands) => {
    const c = commands.find(
      (command) => command.names.find((v) => v == parts[0]) !== undefined
    );
    c?.handler(useInputsStore, parts, navigate);
    useInputsStore.getState().clear("commandMode");
  });
};
