import { useEffect, useRef, type DependencyList } from "react";

// Runs callback exactly once — as soon as all deps are truthy.
// Does NOT mark as fired while any dep is falsy, so it will retry when deps become ready.
export default (callback: () => void, deps: DependencyList = []) => {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (deps.some((d) => !d)) return;
    fired.current = true;
    callback();
  }, deps);
};
