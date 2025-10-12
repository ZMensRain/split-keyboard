import { useState } from "react";

export type inputInitial = {
  defaultText?: string;
  defaultCursor?: number;
};

export interface input {
  text: string;
  cursor: number;
  blink: boolean;
  insert: (text: string) => void;
  remove: (amount: number) => void;
  moveCursor: (amount: number) => void;
  download: (file: string) => void;
  rawAccess: {
    setText: (value: string) => void;
    setCursor: (value: number) => void;
  };
}

export default function useInputs(
  initial: { [key: string]: inputInitial },
  initialActive: string = "main"
) {
  let initialCursors: { [key: string]: number } = {};
  let initialTexts: { [key: string]: string } = {};

  for (const key in initial) {
    if (Object.prototype.hasOwnProperty.call(initial, key)) {
      const element = initial[key];
      initialTexts[key] = element.defaultText ?? "";
      initialCursors[key] = element.defaultCursor ?? 0;
    }
  }

  const [active, setActive] = useState(initialActive);
  const [cursors, setCursors] = useState(initialCursors);
  const [texts, setTexts] = useState(initialTexts);

  function setText(name: string, text: string) {
    setTexts((p) => ({ ...p, [name]: text }));
  }
  function setCursor(name: string, cursor: number) {
    setCursors((p) => ({ ...p, [name]: Math.floor(cursor) }));
  }

  function moveCursor(
    name: string,
    amount: number,
    respectBounds: boolean = true
  ) {
    setCursors((p) => {
      if (p[name] === undefined) return { ...p };
      if (respectBounds) {
        return {
          ...p,
          [name]: Math.max(0, Math.min(texts[name].length, p[name] + amount)),
        };
      }
      return { ...p, [name]: p[name] + Math.floor(amount) };
    });
  }

  function insert(name: string, text: string) {
    setTexts((p) => {
      if (p[name] === undefined) return { ...p };
      const cursor = cursors[name];
      const value = p[name];
      let left = value.substring(0, cursor);
      let right = value.substring(cursor);
      return { ...p, [name]: left + text + right };
    });
    moveCursor(name, text.length, false);
  }

  function remove(name: string, amount: number) {
    setTexts((p) => {
      const value = p[name];
      if (value === undefined) return { ...p };

      const cursor = cursors[name];

      const newValue =
        value.substring(0, cursor - amount - 1) + value.substring(cursor);
      return { ...p, [name]: newValue };
    });
    moveCursor(name, -amount);
  }

  function addInput(name: string, options?: inputInitial) {
    setCursor(name, options?.defaultCursor ?? 0);
    setText(name, options?.defaultText ?? "");
  }
  function download(name: string, file: string) {
    //creating an invisible element

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8, " + encodeURIComponent(texts[name])
    );
    element.setAttribute("download", file);
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
  }

  function removeInput(name: string) {}

  function getInput(name: string): input | undefined {
    if (cursors[name] === undefined || texts[name] === undefined)
      return undefined;
    return {
      cursor: cursors[name],
      blink: active == name,
      text: texts[name],
      moveCursor: (amount, respectBounds: boolean = true) =>
        moveCursor(name, amount, respectBounds),
      insert: (text) => insert(name, text),
      remove: (amount) => remove(name, amount),
      download: (file) => download(name, file),
      rawAccess: {
        setCursor: (value) => setCursor(name, value),
        setText: (value) => setText(name, value),
      },
    };
  }

  function getActive(): input | undefined {
    return getInput(active);
  }

  return {
    addInput,
    removeInput,
    getInput,
    getActive,
    setActive,
    raw: {
      cursors,
      texts,
      active,
      setActive,
      setCursors,
      setTexts,
    },
  };
}
