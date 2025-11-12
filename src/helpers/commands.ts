import type { NavigateFunction } from "react-router";
import { useInputsStore } from "./hooks/useInputStore";

export const commands: Array<{
  names: Array<string>;
  handler: (
    store: typeof useInputsStore,
    commandParts: string[],
    navigate: NavigateFunction
  ) => void;
}> = [
  {
    names: ["w", "save", "write"],
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
    handler: (store) => {
      const state = store.getState();
      state.setActiveName("main");
      state.clear("commandMode");
    },
  },
  {
    names: ["settings"],
    handler: (_store, _commandParts: string[], navigate) => {
      navigate("/settings");
    },
  },
  {
    names: ["layout"],
    handler: (store, commandParts: string[]) => {
      if (commandParts.length < 2) return;

      store.setState({ activeLayoutName: commandParts[1] });
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
