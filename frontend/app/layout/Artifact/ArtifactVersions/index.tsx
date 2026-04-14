import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import { type ArtifactQuery } from "app/services/graphql-app/generated";
import { Link } from "react-router";
import { Skeleton } from "app/components/ui/skeleton";
import ArtifactVersionsCard from "./ArtifactVersionsCard";
import ArtifactVersionsReleaseNew from "./ArtifactVersionsReleaseNew";
import { formatGrammarCount } from "app/utils";

interface ArtifactVersionsProps {
  suiObjectId: string;
  versions: NonNullable<ArtifactQuery["artifact"]>["versions"];
  isAdmin: boolean;
  isLoading: boolean;
}

export default ({
  suiObjectId,
  versions,
  isAdmin,
  isLoading,
}: ArtifactVersionsProps) => {
  if (isLoading) return <Skeleton className="min-h-68.5" />;

  if (!versions?.length) return null;

  return (
    <Stack
      className={tv({
        base: [
          isAdmin ? "border border-[#46F1CF]/25" : "border border-[#3B4A45]",

          "bg-[#191F2D]/40",
          "rounded-lg",
          "py-5 gap-2.5",
        ],
      })()}
    >
      <Center className="w-full px-5 justify-between">
        <Typography font="grotesk" className="text-[#46F1CF] text-xs font-bold">
          Version History
        </Typography>

        <Typography font="jetbrains" className="text-[#84948F] text-2xs">
          {formatGrammarCount(`${versions.length} version`, versions.length)}
        </Typography>
      </Center>

      <Vstack className="w-full px-5 gap-3 max-h-96 overflow-y-auto">
        {versions.map((version) => (
          <Link
            key={version.suiObjectId}
            to={`/artifact/${version.suiObjectId}`}
          >
            <ArtifactVersionsCard version={version} suiObjectId={suiObjectId} />
          </Link>
        ))}
      </Vstack>

      {isAdmin && <ArtifactVersionsReleaseNew />}
    </Stack>
  );
};
