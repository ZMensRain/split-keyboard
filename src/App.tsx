import { useState } from "react";
import { defaultLayout } from "./model/keyboardLayout.ts";
import KeyboardSection from "./components/KeyboardSection.tsx";
import Output from "./components/Output.tsx";
import type { KeyPressEvent } from "./components/Key.tsx";

function App() {
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);
  const [commandCursor] = useState(0);

  function moveCursor(amount: number, ignoreUpperBound = false) {
    setCursor((prev) => {
      if (prev + amount < 0) return 0;
      if (ignoreUpperBound) return prev + amount;
      if (prev + amount > text.length) return text.length;
      return prev + amount;
    });
  }

  function handleKeyClick({ action, payload }: KeyPressEvent) {
    // prevents invalid keys
    if (action == null || payload == null) return;
    if (action.toLowerCase() == "insert") {
      setText(
        (prev) => prev.substring(0, cursor) + payload + prev.substring(cursor)
      );
      moveCursor(1, true);
    }
    if (action.toLowerCase() == "remove" && typeof payload == "number") {
      setText(
        (prev) => prev.substring(0, cursor - payload) + prev.substring(cursor)
      );
      moveCursor(-1);
    }
    if (action.toLowerCase() == "cursor" && typeof payload == "number")
      moveCursor(payload);
    if (action.toLowerCase() == "save") {
      handleSave();
      return;
    }
  }

  function download(file: string, text: string) {
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

  function handleSave() {
    download("default.txt", text);
  }
  return (
    <main>
      <KeyboardSection
        name="left"
        keys={defaultLayout.left}
        onKeyClick={handleKeyClick}
      />
      <section id="content">
        <Output cursor={cursor} text={text} />
      </section>
      <KeyboardSection
        name="right"
        keys={defaultLayout.right}
        onKeyClick={handleKeyClick}
      />
      <section id="status">
        <Output cursor={commandCursor} text={""} blink={false} />
      </section>
    </main>
  );
}

export default App;
