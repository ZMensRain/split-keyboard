import { defaultLayout } from "./model/keyboardLayout.ts";
import KeyboardSection from "./components/KeyboardSection.tsx";
import Output from "./components/Output.tsx";
import type { KeyPressEvent } from "./components/Key.tsx";
import useInputs from "./helpers/hooks/useInputs.ts";

function App() {
  const inputs = useInputs({
    main: {},
    commandMode: {},
  });

  function handleKeyClick({ action, payload }: KeyPressEvent) {
    // prevents invalid keys
    if (action == null || payload == null) return;

    action = action.toLowerCase();

    const activeInputObj = inputs.getActive();

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
      inputs.setActive(payload);
    } else if (action == "enter") {
      if (inputs.raw.active == "commandMode") {
        handleCommand(inputs.getInput("commandMode")?.text ?? "");
        return;
      }
      activeInputObj?.insert("\n");
    }
  }

  const commands = [
    {
      names: ["w", "save", "write"],
      handler: (userInputs: typeof inputs, commandParts: string[]) => {
        if (commandParts.length < 2) return;
        userInputs.getInput("main")?.download(commandParts[1]);
      },
    },
    {
      names: ["exit", "q", "quit"],
      handler: (_userInputs: typeof inputs, _commandParts: string[]) => {
        inputs.setActive("main");
      },
    },
  ];

  function handleCommand(command: string) {
    let parts = command.split(" ");

    let c = commands.find(
      (command) => command.names.find((v) => v == parts[0]) !== undefined
    );
    c?.handler(inputs, parts);
    inputs.getInput("commandMode")?.rawAccess.setText("");
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
          cursor={inputs.getInput("main")?.cursor ?? 0}
          text={inputs.getInput("main")?.text ?? ""}
          blink={inputs.getInput("main")?.blink ?? false}
        />
      </section>
      <KeyboardSection
        name="right"
        keys={defaultLayout.right}
        onKeyClick={handleKeyClick}
      />
      <section id="status">
        <Output
          prefix=": "
          cursor={inputs.getInput("commandMode")?.cursor ?? 0}
          text={inputs.getInput("commandMode")?.text ?? ""}
          blink={inputs.getInput("commandMode")?.blink ?? false}
        />
      </section>
    </main>
  );
}

export default App;
