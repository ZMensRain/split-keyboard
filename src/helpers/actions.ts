import { useInputsStore } from "./hooks/useInputStore";

type Action = {
  description: string;
  handler: (
    payload: unknown,
    store: typeof useInputsStore,
    handleCommand: (command: string) => void
  ) => void;
};

type Actions = {
  [key: string]: Action;
};

const actions: Actions = {
  insert: {
    description:
      "Inserts the payload at the cursor position if it is of type string else it does nothing",
    handler: (payload, store) => {
      if (typeof payload !== "string") return;
      const state = store.getState();
      state.insert(state.activeName, payload);
    },
  },
  remove: {
    description:
      "Removes the amount specified by the payload of characters from the cursor position",
    handler: (payload, store) => {
      if (typeof payload !== "number") return;
      const state = store.getState();
      state.remove(state.activeName, payload);
    },
  },
  cursor: {
    description:
      "Moves the cursor by the amount specified by the payload can be negative or positive",
    handler: (payload, store) => {
      if (typeof payload !== "number") return;
      const state = store.getState();
      state.moveCursor(state.activeName, payload, true);
    },
  },
  switchInput: {
    description:
      "Switches to the input  with the name specified by the payload",
    handler: (payload, store) => {
      if (typeof payload !== "string") return;
      store.getState().setActiveName(payload);
    },
  },
  enter: {
    description:
      "Inserts a newline character or executes a command depending on the selected input",
    handler: (_, store, handleCommand) => {
      const state = store.getState();
      if (state.activeName == "commandMode") {
        const command = state.inputs[state.activeName].text;
        handleCommand(command);
        return;
      }
      state.insert(state.activeName, "\n");
    },
  },
  switchLayout: {
    description:
      "Switches the keyboard layout to the one specified by the payload",
    handler: (payload, store) => {
      if (typeof payload !== "string") return;
      store.setState({ activeLayoutName: payload });
    },
  },
};

export function GetActions(): Actions {
  return actions;
}
