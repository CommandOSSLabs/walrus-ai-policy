import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import Jazzicon from "app/components/Jazzicon";
import useGetConfig from "app/hook/useGetConfig";

export default () => {
  const { contributorConfig } = useGetConfig();

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
          Contributors
        </Typography>

        <button
          className="rounded-lg w-14 h-6"
          style={{
            background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
          }}
        >
          <Typography font="grotesk" className="text-[#00382E]">
            ADD
          </Typography>
        </button>
      </Center>

      <Vstack className="w-full gap-3">
        {[...Array(3)].map((_, index) => {
          return (
            <Flex
              key={index}
              className="bg-[#191F2D] border border-[#3B4A45] rounded-lg px-3 py-2 gap-3"
            >
              <Jazzicon address={index.toString()} className="size-9" />

              <Vstack className="gap-0.5">
                <Typography
                  font="grotesk"
                  className="text-[#DDE2F5] text-xs font-bold"
                >
                  Dr. Sarah Chen
                </Typography>

                <Typography
                  font="jetbrains"
                  className="text-[#84948F] text-2xs"
                >
                  {contributorConfig.data?.[index] || "Unknown"}
                </Typography>
              </Vstack>
            </Flex>
          );
        })}
      </Vstack>
    </Stack>
  );
};
