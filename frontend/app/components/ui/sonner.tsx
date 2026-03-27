import { Toaster as Sonner, type ToasterProps } from "sonner";
import RemoveFill from "public/assets/fill/remove.svg";
import CheckedFill from "public/assets/fill/checked.svg";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckedFill className="size-4" />,
        error: <RemoveFill className="size-4 [&_path]:fill-white" />,
      }}
      style={
        {
          "--normal-bg": "#272B33",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
