import DownloadLine from "public/assets/line/download.svg";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import EyesLine from "public/assets/line/eyes.svg";
import HeartLine from "public/assets/line/heart.svg";
import ShareLine from "public/assets/line/share.svg";

export default () => {
  return (
    <Stack
      className={tv({
        base: [
          "bg-[#191F2D]/40",
          "border border-[#3B4A45] rounded-lg",
          "p-5 gap-6",
        ],
      })()}
    >
      <Vstack className="w-full gap-2.5 text-sm font-bold">
        <button
          className="text-[#00382E] rounded-lg h-10 flex gap-2 items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
          }}
        >
          <DownloadLine />

          <Typography font="grotesk">DOWNLOAD ARTIFACT</Typography>
        </button>

        <button className="text-[#BACAC4] flex items-center justify-center gap-2 border border-[#3B4A45] h-10 rounded-lg">
          <HeartLine />

          <Typography font="grotesk">SPONSOR</Typography>
        </button>

        <button className="text-[#BACAC4] flex items-center justify-center gap-2 border border-[#3B4A45] h-10 rounded-lg">
          <ShareLine />

          <Typography font="grotesk">SHARE</Typography>
        </button>
      </Vstack>

      <Hstack className="gap-3 text-[#BACAC4] text-xs">
        <Hstack>
          <EyesLine />

          <Typography font="jetbrains">12.4K views</Typography>
        </Hstack>

        <Hstack>
          <DownloadLine />

          <Typography font="jetbrains">842 downloads</Typography>
        </Hstack>
      </Hstack>
    </Stack>
  );
};
