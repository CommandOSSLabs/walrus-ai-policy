import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import { formatCalendar } from "app/utils";

export default () => {
  return (
    <Stack
      className={tv({
        base: [
          "bg-[#191F2D]/40",
          "border border-[#3B4A45] rounded-lg",
          "p-5 gap-2.5",
        ],
      })()}
    >
      <Center className="w-full justify-between text-xs font-bold">
        <Typography font="grotesk" className="text-[#46F1CF]">
          Version History
        </Typography>

        <button
          className="rounded-lg w-14 h-6"
          style={{
            background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
          }}
        >
          <Typography font="grotesk" className="text-[#00382E]">
            NEW
          </Typography>
        </button>
      </Center>

      <Vstack className="w-full gap-3">
        {[...Array(3)].map((_, index) => (
          <Flex
            key={index}
            className={tv({
              base: [
                index === 0
                  ? "border-[#46F1CF] bg-[#46F1CF]/10"
                  : "border-[#46F1CF]/50",

                "flex-col justify-center",
                "px-3 h-14.5",
                "border rounded-lg",
              ],
            })()}
          >
            <Center className="justify-between">
              <Typography
                font="jetbrains"
                className="text-[#46F1CF] text-xs font-bold"
              >
                V{index}
              </Typography>

              <Typography
                font="jetbrains"
                className="text-[#84948F] text-2xs font-medium"
              >
                {formatCalendar(new Date().getTime())}
              </Typography>
            </Center>

            <Typography
              font="grotesk"
              className="text-[#DDE2F5]/65 text-xs font-bold"
            >
              Author: Dr. Sarah {index}
            </Typography>
          </Flex>
        ))}
      </Vstack>
    </Stack>
  );
};
