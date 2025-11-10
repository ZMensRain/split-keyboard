import { memo, useEffect, useRef } from "react";

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

// How often while a key is held should the action be triggered measured in ms
const HOLD_INTERVAL = 200;

// How long a user must hold down on a key before it starts triggering the action every HOLD_INTERVAL measured in ms
const HOLD_START_OFFSET = 700;

const Key = memo((props: props) => {
  const intervalRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);
  const visual =
    props.action == "blank" ? "blank" : props.label ?? props.payload;
  const className = `key key-${visual} unselectable`;
  const style = {
    gridColumn: `span ${props.width}`,
    gridRow: `span ${props.height}`,
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function triggerAction() {
    props.onClick({ action: props.action, payload: props.payload });
  }

  function handleHold() {
    intervalRef.current = setInterval(() => triggerAction(), HOLD_INTERVAL);
  }

  function handleClick() {
    timeoutRef.current = setTimeout(handleHold, HOLD_START_OFFSET);
    triggerAction();
  }

  function stop() {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }

  return (
    <button
      className={className}
      onPointerDown={handleClick}
      onPointerUp={stop}
      onPointerLeave={stop}
      style={style}
      aria-hidden={props.action == "blank"}
    >
      {String(visual)}
    </button>
  );
});

export default Key;
