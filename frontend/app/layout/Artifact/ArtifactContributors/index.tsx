import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import useGetConfig from "app/hook/useGetConfig";
import { type Contributor } from "app/services/graphql-app/generated";
import { Skeleton } from "app/components/ui/skeleton";

import ArtifactContributorsAddRole from "./ArtifactContributorsAddRole";
import ArtifactContributorsCard from "./ArtifactContributorsCard";

interface ArtifactContributorsProps {
  contributors: Contributor[] | undefined;
  rootId: string;
  isAdmin: boolean;
  onRefetch: () => void;
}

export default ({
  contributors,
  rootId,
  isAdmin,
  onRefetch,
}: ArtifactContributorsProps) => {
  const { contributorConfig } = useGetConfig();

  if (contributorConfig.isLoading) return <Skeleton className="min-h-68.5" />;

  if (!contributors?.length) return null;

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

        {isAdmin && contributorConfig.data && (
          <ArtifactContributorsAddRole
            rootId={rootId}
            roles={contributorConfig.data}
            onRefetch={onRefetch}
          />
        )}
      </Center>

      <Vstack className="w-full gap-3">
        {contributors.map((contributor) => (
          <ArtifactContributorsCard
            key={contributor.creator}
            contributor={contributor}
            roles={contributorConfig.data}
            rootId={rootId}
            isAdmin={isAdmin}
            onRefetch={onRefetch}
          />
        ))}
      </Vstack>
    </Stack>
  );
};
