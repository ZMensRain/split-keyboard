import type { NavigateFunction } from "react-router";
import { useInputsStore } from "./hooks/useInputStore";

export const commands: Array<{
  names: Array<string>;
  description?: string;
  handler: (
    store: typeof useInputsStore,
    commandParts: string[],
    navigate: NavigateFunction
  ) => void;
}> = [
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

export const handleCommand = (command: string, navigate: NavigateFunction) => {
  const parts = command.split(" ");
  const c = commands.find(
    (command) => command.names.find((v) => v == parts[0]) !== undefined
  );
  c?.handler(useInputsStore, parts, navigate);
  useInputsStore.getState().clear("commandMode");
};
