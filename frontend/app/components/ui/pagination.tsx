import * as React from "react";

import { Button } from "app/components/ui/button";
import ArrowLine from "public/assets/line/arrow.svg";
import { tv } from "tailwind-variants";
import Typography from "../Typography";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={tv({
        base: ["mx-auto flex w-full justify-center"],
      })({
        className,
      })}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={tv({
        base: ["flex items-center gap-0.5"],
      })({
        className,
      })}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      className={tv({
        base: [
          isActive ? "bg-[#46F1CF]" : "bg-[#9597C6]/5",
          "rounded-sm",
          "text-sm font-medium",
          "size-7",
        ],
      })({
        className,
      })}
      {...props}
    >
      <Typography font="grotesk">{props.children}</Typography>
    </Button>
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={tv({
        base: ["size-7 bg-[#9597C6]/15 rounded-sm"],
      })({
        className,
      })}
      {...props}
    >
      <ArrowLine data-icon="inline-start" />
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={tv({
        base: ["size-7 bg-[#9597C6]/15 rounded-sm rotate-180"],
      })({
        className,
      })}
      {...props}
    >
      <ArrowLine data-icon="inline-end" />
    </PaginationLink>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
