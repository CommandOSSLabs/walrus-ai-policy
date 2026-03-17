import { type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export default (props?: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-testid="hstack"
      {...props}
      className={tv({
        base: ["flex justify-center items-center gap-2"],
      })({
        className: props?.className,
      })}
    />
  );
};
