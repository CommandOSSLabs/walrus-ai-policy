import CalendarLine from "public/assets/line/calendar.svg";
import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import { formatCalendar, formatSuiNS } from "app/utils";
import Hstack from "app/components/Hstack";
import { type ArtifactQuery } from "app/services/graphql-app/generated";
import useSuiNs from "app/hook/useSuiNs";
import { Skeleton } from "app/components/ui/skeleton";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

interface ArtifactVersionsCardProps {
  version: NonNullable<ArtifactQuery["artifact"]>["versions"][number];
  suiObjectId: string;
}
export default ({ version, suiObjectId }: ArtifactVersionsCardProps) => {
  const { data, isLoading } = useSuiNs(version.creator);

  const currentAccount = useCurrentAccount();

  if (isLoading) return <Skeleton className="min-h-14" />;

  return (
    <Flex
      className={tv({
        base: [
          version.suiObjectId === suiObjectId
            ? "border-[#46F1CF] bg-[#46F1CF]/10"
            : "border-[#46F1CF]/50",
          "flex-col gap-1.5 justify-center",
          "px-3 py-2.5",
          "border rounded-lg",
        ],
      })()}
    >
      <Center className="justify-between">
        <Typography
          font="jetbrains"
          className="text-[#46F1CF] text-xs font-bold"
        >
          V{version.version}
        </Typography>

        <Hstack className="text-[#84948F] gap-1">
          <CalendarLine />

          <Typography font="jetbrains" className="text-2xs font-medium">
            {formatCalendar(version.createdAt)}
          </Typography>
        </Hstack>
      </Center>

      <Typography
        font="grotesk"
        className="text-[#DDE2F5]/65 text-xs font-bold"
      >
        Author:&nbsp;
        {formatSuiNS(version.creator, data?.name, currentAccount?.address)}
      </Typography>
    </Flex>
  );
};
