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
    setText: (value: string | ((p: string) => string)) => void;
    setCursor: (value: number | ((p: number) => number)) => void;
  };
}

type Cursors = { [key: string]: number };
type Texts = { [key: string]: string };

export default function useInputs(
  initial: { [key: string]: inputInitial },
  initialActive: string = "main"
) {
  let initialCursors: Cursors = {};
  let initialTexts: Texts = {};

  for (const key in initial) {
    if (Object.prototype.hasOwnProperty.call(initial, key)) {
      const element = initial[key];
      initialTexts[key] = element.defaultText ?? "";
      initialCursors[key] = element.defaultCursor ?? 0;
    }
  }

  const [active, setActive] = useState(initialActive);

  const [inputs, setInputs] = useState({
    cursors: initialCursors,
    texts: initialTexts,
  });

  const [cursors, setCursors] = [
    inputs.cursors,
    (func: (cursors: Cursors, texts: Texts) => Cursors) => {
      setInputs((p) => ({ ...p, cursors: func(p.cursors, p.texts) }));
    },
  ];
  const [texts, setTexts] = [
    inputs.texts,
    (func: (texts: Texts, cursors: Cursors) => Texts) => {
      setInputs((p) => {
        return { ...p, texts: func(p.texts, p.cursors) };
      });
    },
  ];

  function setText(name: string, value: string | ((p: string) => string)) {
    setTexts((p) => {
      let newValue = value;
      if (typeof newValue == "function") newValue = newValue(p[name]);

      return { ...p, [name]: newValue };
    });
  }
  function setCursor(name: string, value: number | ((p: number) => number)) {
    setCursors((p) => {
      let newValue = value;
      if (typeof newValue == "function") newValue = newValue(p[name]);

      return { ...p, [name]: Math.floor(newValue) };
    });
  }

  function moveCursor(
    name: string,
    amount: number,
    respectBounds: boolean = true
  ) {
    setCursors((p, t) => {
      if (p[name] === undefined) return { ...p };
      if (respectBounds) {
        return {
          ...p,
          [name]: Math.max(0, Math.min(t[name].length, p[name] + amount)),
        };
      }

      return { ...p, [name]: p[name] + Math.floor(amount) };
    });
  }

  function insert(name: string, text: string) {
    setTexts((p, c) => {
      if (p[name] === undefined) return { ...p };
      const cursor = c[name];
      const value = p[name];
      let left = value.substring(0, cursor);
      let right = value.substring(cursor);
      return { ...p, [name]: left + text + right };
    });
    moveCursor(name, text.length, false);
  }

  function remove(name: string, amount: number) {
    setTexts((p, c) => {
      const value = p[name];
      if (value === undefined) return { ...p };

      const cursor = c[name];

      const newValue =
        value.substring(0, cursor - amount) + value.substring(cursor);

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

  function removeInput(name: string) {
    // prevent broken state where the user is trying to type but the active input does not exist
    if (active == name) setActive("commandMode");
    // remove it from the cursors
    setCursors((c) => {
      const newCursors = { ...c };
      delete newCursors[name];
      return newCursors;
    });
    // remove it from the texts
    setTexts((t) => {
      const newTexts = { ...t };
      delete newTexts[name];
      return newTexts;
    });
  }

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

  function getActive() {
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
