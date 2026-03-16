import { type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export default (props?: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      aria-label="stack"
      {...props}
      className={tv({
        base: ["flex items-center flex-col gap-2"],
      })({
        className: props?.className,
      })}
    />
  );
};
