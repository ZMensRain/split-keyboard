import { useEffect, useState } from "react";

type props = {
  cursor: number;
  text: string;
  blink?: boolean;
};

export default function Output({ cursor, text, blink = true }: props) {
  const [cursorIsVisible, setCursorIsVisible] = useState(false);
  useEffect(() => {
    let id: number;
    if (blink) {
      id = setInterval(() => {
        setCursorIsVisible((pre) => {
          return !pre;
        });
      }, 700);
    }
    return () => clearInterval(id);
  }, [blink]);
  return (
    <p>
      <span>{text.substring(0, cursor)}</span>
      <b>{cursorIsVisible ? "|" : ""}</b>
      <span>{text.substring(cursor)}</span>
    </p>
  );
}
