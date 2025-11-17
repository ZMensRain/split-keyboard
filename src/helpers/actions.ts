import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { useInputsStore } from "./hooks/useInputStore";

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

type Actions = {
  [key: string]: Action;
};

const actions: Actions = {
  insert: {
    name: "insert",
    description:
      "Inserts the payload at the cursor position if it is of type string else it does nothing",
    handler: (payload, store) => {
      if (typeof payload !== "string") return;
      const state = store.getState();
      state.insert(state.activeName, payload);
    },
  },
  remove: {
    name: "remove",
    description:
      "Removes the amount specified by the payload of characters from the cursor position",
    handler: (payload, store) => {
      if (typeof payload !== "number") return;
      const state = store.getState();
      state.remove(state.activeName, payload);
    },
  },
  cursor: {
    name: "cursor",
    description:
      "Moves the cursor by the amount specified by the payload can be negative or positive",
    handler: (payload, store) => {
      if (typeof payload !== "number") return;
      const state = store.getState();
      state.moveCursor(state.activeName, payload, true);
    },
  },
  switchInput: {
    name: "switchInput",
    description:
      "Switches to the input  with the name specified by the payload",
    handler: (payload, store) => {
      if (typeof payload !== "string") return;
      store.getState().setActiveName(payload);
    },
  },
  enter: {
    name: "enter",
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
    name: "switchLayout",
    description:
      "Switches the keyboard layout to the one specified by the payload",
    handler: (payload, store) => {
      if (typeof payload !== "string") return;
      store.setState({ activeLayoutName: payload });
    },
  },
};

function GetActionFromProducer(producer: ActionProducer): Action | undefined {
  let action: unknown;
  try {
    action = eval?.('"use strict"; ' + producer.producer)?.();
  } catch (error) {
    console.error(error, "When eval called on user action producer");
    action = undefined;
  }
  // add some runtime protection against invalid actions
  if (!isAction(action)) return;
  return action;
}

export async function GetActions(): Promise<Actions> {
  const output: Actions = {};
  // Could be a security issue here, but I don't think it's a big deal will add a warning when adding a new action
  const request = await db.UserActions.toArray();
  request.forEach((actionProducer) => {
    const action = GetActionFromProducer(actionProducer);
    if (action == undefined) return;

    output[actionProducer.name] = action;
  });

  return { ...output, ...actions };
}

export async function AddAction(
  name: string,
  producer: string
): Promise<boolean> {
  if (name in actions) {
    alert("Cannot override built in actions");
    return false;
  }
  const action = GetActionFromProducer({ name, producer });

  if (action == undefined) {
    alert("Invalid Producer function");
    return false;
  }

  if (action.name !== name) {
    alert("Different names provided for the same action");
    return false;
  }

  db.UserActions.put({
    name: name,
    producer: producer,
  });
  return true;
}

export async function DeleteAction(name: string) {
  await db.UserActions.delete(name);
}

export function useActions(dependencies: unknown[]): Actions {
  const out = useLiveQuery(() => GetActions(), dependencies);

  return out ?? actions;
}
