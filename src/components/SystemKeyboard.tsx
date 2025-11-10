import { useCallback, useEffect } from "react";
import type { KeyPressEvent } from "./Key";

type props = {
  onClick: (ev: KeyPressEvent) => void;
};

const handleKeyboardDown = (
  ev: KeyboardEvent,
  handler: (ev: KeyPressEvent) => void
) => {
  if (ev.key == "Backspace") handler({ action: "remove", payload: 1 });
  else if (ev.key == "Delete") {
    handler({ action: "remove", payload: -1 });
  } else if (ev.key == "Escape") {
    handler({ action: "switchInput", payload: "commandMode" });
  } else if (ev.key == "ArrowRight") {
    handler({ action: "cursor", payload: 1 });
  } else if (ev.key == "ArrowLeft") {
    handler({ action: "cursor", payload: -1 });
  } else if (ev.key == "Enter") {
    handler({ action: "enter", payload: 1 });
  } else if (ev.key.length == 1) {
    handler({ action: "insert", payload: ev.key });
  }
};

export default function SystemKeyboard({ onClick }: props) {
  const keyboardWrapper = useCallback(
    (ev: KeyboardEvent) => handleKeyboardDown(ev, onClick),
    [onClick]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyboardWrapper);
    return () => document.removeEventListener("keydown", keyboardWrapper);
  }, [keyboardWrapper]);

  return <></>;
}
