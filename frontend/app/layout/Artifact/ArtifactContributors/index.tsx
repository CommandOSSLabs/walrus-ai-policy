import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import useGetConfig from "app/hook/useGetConfig";
import { type Contributor } from "app/services/graphql-app/generated";
import { Skeleton } from "app/components/ui/skeleton";
import { useState } from "react";

import ArtifactContributorsAddRole from "./ArtifactContributorsAddRole";
import ArtifactContributorsCard from "./ArtifactContributorsCard";

interface ArtifactContributorsProps {
  contributorConfig: ReturnType<typeof useGetConfig>["contributorConfig"];
  contributors: Contributor[] | undefined;
  suiObjectId: string;
  isAdmin: boolean;
}

export default ({
  contributorConfig,
  contributors,
  suiObjectId,
  isAdmin,
}: ArtifactContributorsProps) => {
  const [isAddRole, setIsAddRole] = useState(false);

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

        {isAdmin && (
          <button
            className="rounded-lg w-14 h-6"
            onClick={() => setIsAddRole((prev) => !prev)}
            style={{
              background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
            }}
          >
            <Typography font="grotesk" className="text-[#00382E]">
              ADD
            </Typography>
          </button>
        )}
      </Center>

      {isAddRole && contributorConfig.data && (
        <ArtifactContributorsAddRole
          suiObjectId={suiObjectId}
          roles={contributorConfig.data}
          onRefetch={() => setIsAddRole(false)}
        />
      )}

      <Vstack className="w-full gap-3">
        {contributors.map((contributor) => (
          <ArtifactContributorsCard
            key={contributor.creator}
            contributor={contributor}
            roles={contributorConfig.data}
            suiObjectId={suiObjectId}
            isAdmin={isAdmin}
          />
        ))}
      </Vstack>
    </Stack>
  );
};
