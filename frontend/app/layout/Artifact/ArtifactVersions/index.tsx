import CalendarLine from "public/assets/line/calendar.svg";
import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import { formatCalendar, shorten } from "app/utils";
import Hstack from "app/components/Hstack";
import { type ArtifactVersionsQuery } from "app/services/graphql-app/generated";
import { Link, useSearchParams } from "react-router";
import { Skeleton } from "app/components/ui/skeleton";

interface ArtifactVersionsProps {
  suiObjectId: string;
  versions: ArtifactVersionsQuery["artifactVersions"] | undefined;
  isAdmin: boolean;
  isLoading: boolean;
}

export default ({
  suiObjectId,
  versions,
  isAdmin,
  isLoading,
}: ArtifactVersionsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (isLoading) return <Skeleton className="min-h-68.5" />;

  if (!versions?.length) return null;

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

        {isAdmin && (
          <button
            className="rounded-lg w-14 h-6"
            style={{
              background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
            }}
            onClick={() => {
              searchParams.set("release", "true");

              setSearchParams(searchParams);
            }}
          >
            <Typography font="grotesk" className="text-[#00382E]">
              NEW
            </Typography>
          </button>
        )}
      </Center>

      <Vstack className="w-full gap-3">
        {versions.map((meta) => (
          <Link key={meta.suiObjectId} to={`/artifact/${meta.suiObjectId}`}>
            <Flex
              className={tv({
                base: [
                  meta.suiObjectId === suiObjectId
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
                  V{meta.version}
                </Typography>

                <Hstack className="text-[#84948F] gap-1">
                  <CalendarLine />

                  <Typography font="jetbrains" className="text-2xs font-medium">
                    {formatCalendar(meta.createdAt)}
                  </Typography>
                </Hstack>
              </Center>

              <Typography
                font="grotesk"
                className="text-[#DDE2F5]/65 text-xs font-bold"
              >
                Author: {shorten(meta.creator)}
              </Typography>
            </Flex>
          </Link>
        ))}
      </Vstack>
    </Stack>
  );
};
