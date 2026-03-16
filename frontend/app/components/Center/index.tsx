import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export default forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return (
      <div
        aria-label="center"
        {...props}
        ref={ref}
        className={tv({
          base: ["flex justify-center items-center"],
        })({
          className: props?.className,
        })}
      />
    );
  },
);
