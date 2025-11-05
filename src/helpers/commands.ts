import type { useNavigate } from "react-router";
import type useInputs from "./hooks/useInputs";

export const commands: Array<{
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
