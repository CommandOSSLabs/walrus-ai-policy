import { tv } from "tailwind-variants";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={tv({
        base: ["animate-pulse rounded-md bg-white/12"],
      })({
        className,
      })}
      {...props}
    />
  );
}

export { Skeleton };
