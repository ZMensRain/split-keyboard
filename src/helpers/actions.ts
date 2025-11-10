import { useInputsStore } from "./hooks/useInputStore";
import { getLayout } from "./keyboardLayouts";

type action = (
  payload: unknown,
  activeName: string,
  handleCommand: (command: string) => void
) => void;

type props = {
  [key: string]: action;
};

export const actions: props = {
  insert: (payload, activeName) => {
    if (typeof payload !== "string") return;
    useInputsStore.getState().insert(activeName, payload);
  },
  remove: (payload, activeName) => {
    if (typeof payload !== "number") return;
    useInputsStore.getState().remove(activeName, payload);
  },
  cursor: (payload, activeName) => {
    if (typeof payload !== "number") return;
    useInputsStore.getState().moveCursor(activeName, payload, true);
  },
  switchInput: (payload) => {
    if (typeof payload !== "string") return;
    useInputsStore.getState().setActiveName(payload);
  },
  enter: (_, activeName, handleCommand) => {
    if (activeName == "commandMode") {
      const command = useInputsStore.getState().inputs[activeName].text;
      handleCommand(command);
      return;
    }
    useInputsStore.getState().insert(activeName, "\n");
  },
  switchLayout: (payload) => {
    if (typeof payload !== "string") return;
    useInputsStore.setState({ keyboardLayout: getLayout(payload) });
  },
};
