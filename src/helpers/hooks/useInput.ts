import { useState } from "react";

export type useInputOptions = {
  defaultText?: string;
  defaultCursor?: number;
  defaultBlink?: boolean;
};

export type useInputReturnType = {
  text: string;
  cursor: number;
  blink: boolean;
  insert: (text: string) => void;
  remove: (amount: number) => void;
  moveCursor: (amount: number) => void;
  download: (file: string) => void;
  rawAccess: {
    setText: React.Dispatch<React.SetStateAction<string>>;
    setCursor: React.Dispatch<React.SetStateAction<number>>;
    setBlink: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export default function useInput(
  options?: useInputOptions
): useInputReturnType {
  const [text, setText] = useState<string>(options?.defaultText ?? "");
  const [cursor, setCursor] = useState<number>(options?.defaultCursor ?? 0);
  const [blink, setBlink] = useState<boolean>(options?.defaultBlink ?? false);

  function moveCursor(amount: number, ignoreUpperBound = false) {
    setCursor((prev) => {
      if (prev + amount < 0) return 0;
      if (ignoreUpperBound) return prev + amount;
      if (prev + amount > text.length) return text.length;
      return prev + amount;
    });
  }

  function download(file: string) {
    //creating an invisible element

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8, " + encodeURIComponent(text)
    );
    element.setAttribute("download", file);
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
  }

  function insert(text: string) {
    setText(
      (prev) => prev.substring(0, cursor) + text + prev.substring(cursor)
    );
    moveCursor(1, true);
  }

  function remove(amount: number) {
    setText(
      (prev) => prev.substring(0, cursor - amount) + prev.substring(cursor)
    );
    moveCursor(-amount);
  }

  let rawAccess = {
    setText,
    setCursor,
    setBlink,
  };

  return {
    text,
    cursor,
    blink,
    insert,
    remove,
    moveCursor,
    download,
    rawAccess,
  };
}
