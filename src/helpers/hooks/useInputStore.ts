import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Inputs = { [key: string]: Input };

export type Input = { text: string; cursor: number };

type InputsState = {
  inputs: Inputs;
  activeName: string;
  activeLayoutName: string;
  setActiveName: (name: string) => void;
  insert: (name: string, text: string) => void;
  remove: (name: string, amount: number) => void;
  moveCursor: (name: string, amount: number, respectBounds: boolean) => void;
  clear: (name: string) => void;
};

export const useInputsStore = create<InputsState>()(
  immer((set) => ({
    inputs: {
      main: { cursor: 0, text: "" },
      commandMode: { cursor: 0, text: "" },
    },
    activeName: "main",
    activeLayoutName: "default",
    setActiveName: (name) =>
      set((state) => {
        state.activeName = name;
      }),
    insert: (name, text) => {
      set((state) => {
        const p = state.inputs[name];

        const nText =
          p.text.substring(0, p.cursor) + text + p.text.substring(p.cursor);
        state.inputs[name].text = nText;
        state.inputs[name].cursor += text.length;
      });
    },
    remove: (name, amount) => {
      set((state) => {
        const { text, cursor } = state.inputs[name];

        if (amount > text.length) return;

        const nText =
          text.substring(0, cursor - amount) + text.substring(cursor);
        const nCursor = cursor - amount;
        state.inputs[name].text = nText;
        state.inputs[name].cursor = Math.max(0, nCursor);
      });
    },
    moveCursor: (name, amount, respectBounds) => {
      set((state) => {
        const { cursor, text } = state.inputs[name];
        let nCursor = cursor;

        if (respectBounds)
          nCursor = Math.max(0, Math.min(text.length, cursor + amount));
        else nCursor += amount;

        state.inputs[name].cursor = Math.floor(nCursor);
      });
    },
    clear: (name: string) => {
      set((state) => {
        state.inputs[name].text = "";
        state.inputs[name].cursor = 0;
      });
    },
  }))
);
