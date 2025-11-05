import KeyboardSection from "./components/KeyboardSection.tsx";
import Output from "./components/Output.tsx";
import type { KeyPressEvent } from "./components/Key.tsx";
import useInputs from "./helpers/hooks/useInputs.ts";
import { useMemo } from "react";
import { getLayout } from "./helpers/keyboardLayouts.ts";
import { useState } from "react";
import { useNavigate } from "react-router";

const commands: Array<{
  names: Array<string>;
  handler: (
    userInputs: ReturnType<typeof useInputs>,
    commandParts: string[],
    navigate: ReturnType<typeof useNavigate>
  ) => void;
}> = [
  {
    names: ["w", "save", "write"],
    handler: (userInputs, commandParts) => {
      if (commandParts.length < 2) return;
      userInputs.getInput("main")?.download(commandParts[1]);
    },
  },
  {
    names: ["exit", "q", "quit"],
    handler: (userInputs, _commandParts) => {
      userInputs.setActive("main");
    },
  },
  {
    names: ["settings"],
    handler: (_userInputs, _commandParts: string[], navigate) => {
      navigate("/settings");
    },
  },
];

function App() {
  const inputs = useInputs({
    main: {},
    commandMode: {},
  });
  const navigate = useNavigate();
  const [keyboardLayout, setKeyboardLayout] = useState(getLayout("default"));

  const handleCommand = (
    command: string,
    inputs: ReturnType<typeof useInputs>
  ) => {
    let parts = command.split(" ");
    let c = commands.find(
      (command) => command.names.find((v) => v == parts[0]) !== undefined
    );
    c?.handler(inputs, parts, navigate);
    inputs.getInput("commandMode")?.rawAccess.setText("");
  };

  const actions: {
    [key: string]: (
      userInputs: ReturnType<typeof useInputs>,
      payload: any
    ) => void;
  } = {
    insert: (inputs, payload) => {
      if (typeof payload !== "string") return;
      inputs.getActive()?.insert(payload);
    },
    remove: (inputs, payload) => {
      if (typeof payload !== "number") return;
      inputs.getActive()?.remove(payload);
    },
    cursor: (inputs, payload) => {
      if (typeof payload !== "number") return;
      inputs.getActive()?.moveCursor(payload);
    },
    save: (inputs, _) => {
      inputs.getActive()?.download("default");
    },
    switchInput: (inputs, payload) => {
      if (typeof payload !== "string") return;
      inputs.setActive(payload);
    },
    enter: (inputs, _) => {
      if (inputs.raw.active == "commandMode") {
        handleCommand(inputs.raw.texts["commandMode"], inputs);
        return;
      }
      inputs.getActive()?.insert("\n");
    },
    switchLayout: (_, payload) => {
      if (typeof payload == "string") setKeyboardLayout(getLayout(payload));
    },
  };

  const mainInput = inputs.getInput("main");
  const commandModeInput = inputs.getInput("commandMode");

  const handleKeyClick = useMemo(
    () =>
      ({ action, payload }: KeyPressEvent) => {
        // prevents invalid keys
        if (action == null || payload == null) return;

        actions[action](inputs, payload);
      },
    [inputs.raw.active, commandModeInput?.text]
  );

  return (
    <main>
      <KeyboardSection
        name="left"
        keys={keyboardLayout.left}
        onKeyClick={handleKeyClick}
      />
      <section id="content">
        <Output
          cursor={mainInput?.cursor ?? 0}
          text={mainInput?.text ?? ""}
          blink={mainInput?.blink ?? false}
        />
      </section>
      <KeyboardSection
        name="right"
        keys={keyboardLayout.right}
        onKeyClick={handleKeyClick}
      />
      <section id="status">
        <Output
          prefix=": "
          cursor={commandModeInput?.cursor ?? 0}
          text={commandModeInput?.text ?? ""}
          blink={commandModeInput?.blink ?? false}
        />
      </section>
    </main>
  );
}

export default App;
