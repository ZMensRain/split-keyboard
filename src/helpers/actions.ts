import type { KeyboardLayout } from "../model/keyboardLayout";
import type useInputs from "./hooks/useInputs";
import { getLayout } from "./keyboardLayouts";

type action = (
  userInputs: ReturnType<typeof useInputs>,
  payload: any,
  setKeyboardLayout: (layout: KeyboardLayout) => void,
  handleCommand: (command: string, inputs: ReturnType<typeof useInputs>) => void
) => void;

type props = {
  [key: string]: action;
};

export const actions: props = {
  insert: (inputs, payload) => {
    if (typeof payload === "string") inputs.getActive()?.insert(payload);
  },
  remove: (inputs, payload) => {
    if (typeof payload == "number") inputs.getActive()?.remove(payload);
  },
  cursor: (inputs, payload) => {
    if (typeof payload == "number") inputs.getActive()?.moveCursor(payload);
  },
  save: (inputs, _) => {
    inputs.getActive()?.download("default");
  },
  switchInput: (inputs, payload) => {
    if (typeof payload == "string") inputs.setActive(payload);
  },
  enter: (inputs, _, _1, handleCommand) => {
    if (inputs.raw.active == "commandMode") {
      inputs.getActive()?.rawAccess.setText((p) => {
        handleCommand(p, inputs);
        return "";
      });
    }
    inputs.getActive()?.insert("\n");
  },
  switchLayout: (_, payload, setKeyboardLayout) => {
    if (typeof payload == "string") setKeyboardLayout(getLayout(payload));
  },
};
