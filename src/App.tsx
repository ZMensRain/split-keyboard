import KeyboardSection from "./components/KeyboardSection.tsx";
import Output from "./components/Output.tsx";
import type { KeyPressEvent } from "./components/Key.tsx";
import useInputs from "./helpers/hooks/useInputs.ts";
import { useCallback } from "react";
import { getLayout } from "./helpers/keyboardLayouts.ts";
import { useState } from "react";
import { useNavigate } from "react-router";
import { actions } from "./helpers/actions.ts";
import { commands } from "./helpers/commands.ts";

function App() {
  const inputs = useInputs({
    main: {},
    commandMode: {},
  });
  const navigate = useNavigate();
  const [keyboardLayout, setKeyboardLayout] = useState(getLayout("default"));
  const mainInput = inputs.getInput("main");
  const commandModeInput = inputs.getInput("commandMode");

  const handleCommand = (
    command: string,
    inputs: ReturnType<typeof useInputs>
  ) => {
    let parts = command.split(" ");
    let c = commands.find(
      (command) => command.names.find((v) => v == parts[0]) !== undefined
    );
    c?.handler(inputs, parts, navigate);
  };

  const handleKeyClick = useCallback(
    ({ action, payload }: KeyPressEvent) => {
      // prevents invalid keys
      if (action == null || payload == null) return;

      actions[action](inputs, payload, setKeyboardLayout, handleCommand);
    },
    [inputs.raw.active]
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
