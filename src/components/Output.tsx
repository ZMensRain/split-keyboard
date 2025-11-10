import { useEffect, useState } from "react";
import { useInputsStore } from "../helpers/hooks/useInputStore";

type props = {
  name: string;
  prefix?: string;
};

const BLINK_RATE = 700;

export default function Output(props: props) {
  const [cursorIsVisible, setCursorIsVisible] = useState(false);
  const input = useInputsStore((state) => state.inputs[props.name]);
  const activeName = useInputsStore((state) => state.activeName);
  const blink = activeName === props.name;
  useEffect(() => {
    let id: number;
    // creates an interval for blinking if blink is true
    if (blink) id = setInterval(handleBlink, BLINK_RATE);

    return () => {
      setCursorIsVisible(false);
      clearInterval(id);
    };
  }, [blink]);

  function handleBlink() {
    setCursorIsVisible((pre) => !pre);
  }

  if (input == undefined) {
    return <div>Input does not exist</div>;
  }

  return (
    <p>
      <span>{props.prefix}</span>
      <span>{input.text.substring(0, input.cursor)}</span>
      <b>{cursorIsVisible ? "|" : ""}</b>
      <span>{input.text.substring(input.cursor)}</span>
    </p>
  );
}
