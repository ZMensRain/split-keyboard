import type { KeyPressEvent, KeyType } from "./Key.tsx";
import Key from "./Key.tsx";

type props = {
  name: string;
  keys: KeyType[];
  onKeyClick: (event: KeyPressEvent) => void;
};

export default function KeyboardSection(props: props) {
  const keys = props.keys;

  return (
    <section id={props.name}>
      {keys.map((keyboardKey) => (
        <Key {...keyboardKey} onClick={props.onKeyClick} />
      ))}
    </section>
  );
}
