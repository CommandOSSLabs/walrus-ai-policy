import * as React from "react";
import { Slot } from "radix-ui";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: [
    "group/badge",
    "inline-flex items-center",
    "uppercase text-xs",
    "border rounded-xl",
    "px-5 py-2",
  ],
  variants: {
    type: {
      red: "text-[#FF4D4D] border-[#FF4D4D]/40",
      cyan: "text-[#00D4FF] border-[#00D4FF]/40",
      gold: "text-[#FFD700] border-[#FFD700]/40",
    },

    active: {
      red: "bg-[#FF4D4D]/20",
      cyan: "bg-[#00D4FF]/20",
      gold: "bg-[#FFD700]/20",
    },
  },
});

function Badge({
  className,
  type,
  active,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-active={!!active}
      data-type={type}
      className={badgeVariants({
        active,
        type,
        className,
      })}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
