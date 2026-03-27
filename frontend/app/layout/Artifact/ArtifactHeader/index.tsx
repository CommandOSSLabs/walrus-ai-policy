import Flex from "app/components/Flex";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import { Badge } from "app/components/ui/badge";
import Vstack from "app/components/Vstack";
import type { ArtifactQuery } from "app/services/graphql-app/generated";
import { formatCalendar } from "app/utils";
import utilsConstants from "app/utils/utils.constants";
import CalendarLine from "public/assets/line/calendar.svg";

interface ArtifactHeaderProps {
  artifact: NonNullable<ArtifactQuery["artifact"]>;
}

export default ({ artifact }: ArtifactHeaderProps) => {
  const getTypeResource = utilsConstants.FORMAT_RESOURCE.find(
    (resource) => resource.key === artifact.category,
  );

  return (
    <>
      <Hstack className="gap-4">
        <Typography font="jetbrains" className="text-[#00D4B4] text-sm">
          V{artifact.version}
        </Typography>

        <Hstack className="text-[#BACAC4]">
          <CalendarLine />

          <Typography font="jetbrains" className="text-xs">
            {formatCalendar(artifact.createdAt)}
          </Typography>
        </Hstack>
      </Hstack>

      <Vstack
        className="w-full"
        style={{
          wordBreak: "break-word",
        }}
      >
        <Flex className="gap-4 justify-between">
          <Typography
            font="grotesk"
            className="text-[#DDE2F5] text-2xl font-medium flex-1"
          >
            {artifact.title}
          </Typography>

          <Badge type={getTypeResource?.type} className="h-5 px-2">
            <Typography font="grotesk" className="text-2xs font-bold">
              {artifact.category}
            </Typography>
          </Badge>
        </Flex>

        <Typography className="text-[#BACAC4]">
          {artifact.description}
        </Typography>
      </Vstack>
    </>
  );
};
