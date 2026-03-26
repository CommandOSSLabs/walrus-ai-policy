import { useEffect, type RefObject } from "react";

type EventType = MouseEvent | TouchEvent;

export default <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: EventType) => void,
) => {
  useEffect(() => {
    function listener(event: EventType) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
