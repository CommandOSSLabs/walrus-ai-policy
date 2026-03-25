import * as React from "react";
import { Slot } from "radix-ui";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: [
    "inline-flex items-center justify-center",
    "rounded-lg border border-transparent",
    "text-sm font-medium whitespace-nowrap",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "group/button shrink-0 bg-clip-padding transition-all outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
});

function Button({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={buttonVariants({ className })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
