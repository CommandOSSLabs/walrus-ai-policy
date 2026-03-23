import ArrowLine from "public/assets/line/arrow.svg";
import Hstack from "app/components/Hstack";
import { tv } from "tailwind-variants";

export default () => {
  return (
    <Hstack className="gap-1.5 mt-8">
      <button className="size-7 bg-[#9597C6]/15 rounded-sm">
        <ArrowLine className="mx-auto" />
      </button>

      {[...Array(4)].map((_, index) => (
        <button
          key={index}
          className={tv({
            base: [
              index + 1 === 4 ? "bg-[#46F1CF]" : "bg-[#9597C6]/5",

              "size-7 rounded-sm",
            ],
          })()}
        >
          {index + 1}
        </button>
      ))}

      <button className="size-7 bg-[#9597C6]/15 rounded-sm opacity-50 rotate-180">
        <ArrowLine className="mx-auto" />
      </button>
    </Hstack>
  );
};
