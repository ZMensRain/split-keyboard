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

const Key = memo((props: props) => {
  const intervalRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);

  const triggerAction = () =>
    props.onClick({ action: props.action, payload: props.payload });

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick() {
    timeoutRef.current = setTimeout(
      () => (intervalRef.current = setInterval(() => triggerAction(), 200)),
      700
    );
    triggerAction();
  }

  function stop() {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }

  const visual = props.label ?? props.payload;
  const className = `key key-${visual} span-x-${props.width} span-y-${props.height} unselectable`;
  if (props.action == "blank") {
    return <div className={className}></div>;
  }
  return (
    <button
      className={className}
      onPointerDown={handleClick}
      onPointerUp={stop}
      onPointerLeave={stop}
    >
      {String(visual)}
    </button>
  );
});

export default Key;
