import type { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export default ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={tv({
        base: ["grid sm:grid-cols-2 xl:grid-cols-3 gap-3"],
      })({
        className,
      })}
      {...props}
    />
  );
};
