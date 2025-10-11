import { defaultLayout } from "./model/keyboardLayout.ts";
import KeyboardSection from "./components/KeyboardSection.tsx";
import Output from "./components/Output.tsx";
import type { KeyPressEvent } from "./components/Key.tsx";
import useInput, { type useInputReturnType } from "./helpers/hooks/useInput.ts";
import { useState } from "react";

function App() {
  const inputs = {
    main: useInput({ defaultBlink: true }),
    commandMode: useInput(),
  };
  const [activeInput, setActiveInput] = useState("main");

  function handleKeyClick({ action, payload }: KeyPressEvent) {
    // prevents invalid keys
    if (action == null || payload == null) return;

    action = action.toLowerCase();

    const activeInputObj: useInputReturnType | undefined =
      inputs[activeInput as keyof typeof inputs];

    if (action == "insert" && typeof payload == "string") {
      activeInputObj?.insert(payload);
    } else if (action == "remove" && typeof payload == "number") {
      activeInputObj?.remove(payload);
    } else if (action == "cursor" && typeof payload == "number") {
      activeInputObj?.moveCursor(payload);
    } else if (action == "save") {
      activeInputObj?.download("default.txt");
    } else if (
      action == "switchInput".toLowerCase() &&
      typeof payload == "string"
    ) {
      inputs[activeInput as keyof typeof inputs].rawAccess.setBlink(false);
      inputs[payload as keyof typeof inputs].rawAccess.setBlink(true);
      setActiveInput(payload);
    }
  }

  return (
    <main>
      <KeyboardSection
        name="left"
        keys={defaultLayout.left}
        onKeyClick={handleKeyClick}
      />
      <section id="content">
        <Output
          cursor={inputs.main.cursor}
          text={inputs.main.text}
          blink={inputs.main.blink}
        />
      </section>
      <KeyboardSection
        name="right"
        keys={defaultLayout.right}
        onKeyClick={handleKeyClick}
      />
      <section id="status">
        <Output
          cursor={inputs.commandMode.cursor}
          text={inputs.commandMode.text}
          blink={inputs.commandMode.blink}
        />
      </section>
    </main>
  );
}

export default App;
