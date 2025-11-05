import { useEffect, useState } from "react";

type props = {
  cursor: number;
  text: string;
  blink?: boolean;
  prefix?: string;
};

const BLINK_RATE = 700;

export default function Output(props: props) {
  const [cursorIsVisible, setCursorIsVisible] = useState(false);
  useEffect(() => {
    let id: number;
    // creates an interval for blinking if blink is true
    if (props.blink) id = setInterval(handleBlink, BLINK_RATE);

    return () => {
      setCursorIsVisible(false);
      clearInterval(id);
    };
  }, [props.blink]);

  function handleBlink() {
    setCursorIsVisible((pre) => !pre);
  }

  return (
    <p>
      <span>{props.prefix}</span>
      <span>{props.text.substring(0, props.cursor)}</span>
      <b>{cursorIsVisible ? "|" : ""}</b>
      <span>{props.text.substring(props.cursor)}</span>
    </p>
  );
}
