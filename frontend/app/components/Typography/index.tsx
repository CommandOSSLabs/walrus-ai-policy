import type { HTMLAttributes, HTMLElementType } from "react";
import React from "react";
import { tv } from "tailwind-variants";

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: HTMLElementType;
  font?: "inter" | "grotesk" | "jetbrains";
}

export default ({
  variant = "p",
  font,
  className,
  ...rest
}: TypographyProps) => {
  const styles = tv({
    variants: {
      font: {
        inter: "font-inter",
        grotesk: "font-Space_Grotesk",
        jetbrains: "font-JetBrains_Mono",
      },
    },
    defaultVariants: {
      font: "inter",
    },
  });

  const element = React.createElement(variant, {
    ...rest,
    className: styles({ font, className }),
  });

  return element;
};
