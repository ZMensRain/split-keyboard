import { memo } from "react";
import type { KeyPressEvent, KeyType } from "./Key.tsx";
import Key from "./Key.tsx";

type props = {
  name: string;
  keys: KeyType[];
  onKeyClick: (event: KeyPressEvent) => void;
};

const KeyboardSection = memo(function KeyboardSection(props: props) {
  const keys = props.keys;

  return (
    <section id={props.name}>
      {keys.map((keyboardKey, index) => (
        <Key
          {...keyboardKey}
          onClick={props.onKeyClick}
          key={String(keyboardKey.payload) + index}
        />
      ))}
    </section>
  );
});
export default KeyboardSection;
