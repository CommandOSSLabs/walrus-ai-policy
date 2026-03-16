import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export default forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return (
      <div
        aria-label="vstack"
        {...props}
        ref={ref}
        className={tv({
          base: ["flex flex-col gap-2"],
        })({
          className: props?.className,
        })}
      />
    );
  },
);
