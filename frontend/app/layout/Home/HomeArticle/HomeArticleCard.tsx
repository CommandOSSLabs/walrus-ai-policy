import CalendarLine from "public/assets/line/calendar.svg";
import EyesLine from "public/assets/line/eyes.svg";
import DownloadLine from "public/assets/line/download.svg";
import Center from "app/components/Center";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { tv } from "tailwind-variants";
import utilsConstants from "app/utils/utils.constants";
import { type Artifact } from "app/services/graphql-app/generated";
import { Badge } from "app/components/ui/badge";

interface HomeArticleCardProps {
  meta: Artifact;
}

export default ({ meta }: HomeArticleCardProps) => {
  const getTypeResource = utilsConstants.FORMAT_RESOURCE.find(
    (resource) => resource.key === meta.category,
  );

  return (
    <Vstack
      className={tv({
        base: [
          "min-h-64 h-full",
          "bg-[#191F2D] gap-5 p-5",
          "border border-[#46F1CF]/20 rounded-lg",
          "transition-colors hover:border-[#46F1CF]",
        ],
      })()}
    >
      <Center className="text-2xs justify-between">
        <Typography font="jetbrains" className="text-[#00D4B4] font-semibold">
          V{meta.version}
        </Typography>

        <Badge type={getTypeResource?.type} className="h-5 px-2">
          <Typography font="grotesk" className="text-2xs font-bold">
            {meta.category}
          </Typography>
        </Badge>
      </Center>

      <Vstack className="gap-2.5 flex-1">
        <Typography
          font="grotesk"
          className="text-[#DDE2F5] text-xl font-bold line-clamp-2"
        >
          {meta.title}
        </Typography>

        <Typography className="text-[#BACAC4] text-sm line-clamp-4">
          {meta.description}
        </Typography>
      </Vstack>

      <Center className="justify-between text-[#84948F] text-2xs">
        <Hstack>
          <CalendarLine />

          <Typography font="jetbrains">
            {(function () {
              const forkDate = new Date(meta.createdAt);

              return `${forkDate.getFullYear()}.${forkDate.getMonth()}.${forkDate.getDate()}`;
            })()}
          </Typography>
        </Hstack>

        <Hstack>
          <Hstack>
            <EyesLine />

            <Typography font="jetbrains">12.5K</Typography>
          </Hstack>

          <Hstack>
            <DownloadLine />

            <Typography font="jetbrains">1.5K</Typography>
          </Hstack>
        </Hstack>
      </Center>
    </Vstack>
  );
};
