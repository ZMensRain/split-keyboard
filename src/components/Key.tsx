import { useRef } from "react";

export type KeyType = {
  label?: string;
  action: string;
  payload: unknown;
  width: number;
  height: number;
};

export type KeyPressEvent = {
  action: string;
  payload: unknown;
};

type props = KeyType & {
  onClick: (event: KeyPressEvent) => void;
};

export default function Key(props: props) {
  const ref = useRef<number | null>(null);

  function handleClick() {
    if (ref.current != null) {
      clearInterval(ref.current);
    }
    props.onClick({ action: props.action, payload: props.payload });
  }

  //   function stop() {
  //     clearInterval(ref.current);
  //     console.log("wow", ref.current);
  //   }

  const visual = props.label ?? props.payload;
  if (props.action == "blank") {
    return <div></div>;
  }
  return (
    <button
      className={"key " + `key-${visual} span-x-${props.width} unselectable`}
      onTouchStart={handleClick}
    >
      {String(visual)}
    </button>
  );
}
