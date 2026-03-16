import { type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export default (props?: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      aria-label="flex"
      {...props}
      className={tv({
        base: ["flex"],
      })({
        className: props?.className,
      })}
    />
  );
};
