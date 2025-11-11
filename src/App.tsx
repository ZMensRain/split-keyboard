import KeyboardSection from "./components/KeyboardSection.tsx";
import Output from "./components/Output.tsx";
import type { KeyPressEvent } from "./components/Key.tsx";
import { useCallback } from "react";
import { actions } from "./helpers/actions.ts";
import SystemKeyboard from "./components/SystemKeyboard.tsx";
import { useInputsStore } from "./helpers/hooks/useInputStore.ts";
import { handleCommand } from "./helpers/commands.ts";
import { useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { getLayout } from "./helpers/keyboardLayouts.ts";
import { defaultLayout } from "./model/keyboardLayout.ts";

function App() {
  const navigate = useNavigate();
  const activeName = useInputsStore((state) => state.activeName);
  const LayoutName = useInputsStore((state) => state.activeLayoutName);
  const keyboardLayout =
    useLiveQuery(() => getLayout(LayoutName), [LayoutName]) ?? defaultLayout;

  const handleKeyClick = useCallback(
    ({ action, payload }: KeyPressEvent) => {
      // prevents invalid keys
      if (action == null || payload == null) return;

      actions[action](payload, activeName, (command: string) => {
        handleCommand(command, navigate);
      });
    },
    [activeName, navigate]
  );

  return (
    <div className="landscape-always">
      <main>
        <KeyboardSection
          name="left"
          keys={keyboardLayout.left}
          onKeyClick={handleKeyClick}
        />
        <section id="content">
          <Output name="main" />
        </section>
        <KeyboardSection
          name="right"
          keys={keyboardLayout.right}
          onKeyClick={handleKeyClick}
        />
        <section id="status">
          <div>
            <Output prefix=": " name="commandMode" />
          </div>
        </section>
        <SystemKeyboard onClick={handleKeyClick}></SystemKeyboard>
      </main>
    </div>
  );
}

export default App;
