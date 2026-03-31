import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import Jazzicon from "app/components/Jazzicon";
import useGetConfig, { contributorConfigEnum } from "app/hook/useGetConfig";
import { type Contributor } from "app/services/graphql-app/generated";
import { Skeleton } from "app/components/ui/skeleton";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { shorten } from "app/utils";
import { useState } from "react";

import ArtifactContributorsAddRole from "./ArtifactContributorsAddRole";
import ArtifactContributorsRemoveRole from "./ArtifactContributorsRemoveRole";

interface ArtifactContributorsProps {
  contributors: Contributor[] | undefined;
  suiObjectId: string;
}

export default ({ contributors, suiObjectId }: ArtifactContributorsProps) => {
  const currentAccount = useCurrentAccount();

  const { contributorConfig } = useGetConfig();

  const [isAddRole, setIsAddRole] = useState(false);

  const isAdmin = contributors?.some(
    (meta) =>
      meta?.creator === currentAccount?.address &&
      contributorConfig.data?.[meta.role] === contributorConfigEnum.admin,
  );

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
        {contributors.map((meta) => {
          const isYou = currentAccount?.address === meta.creator;

          return (
            <Flex
              key={meta.creator}
              className="bg-[#191F2D] border border-[#3B4A45] rounded-lg px-3 py-2 gap-3 group"
            >
              <Jazzicon address={meta.creator} className="size-9" />

              <Vstack className="gap-0.5 flex-1">
                <Typography
                  font="grotesk"
                  className="text-[#DDE2F5] text-xs font-bold"
                >
                  {isYou ? "You" : shorten(meta.creator)}
                </Typography>

                <Typography
                  font="jetbrains"
                  className="text-[#84948F] text-2xs capitalize"
                >
                  {contributorConfig.data?.[meta.role] || "Unknown"}
                </Typography>
              </Vstack>

              {!isYou && isAdmin && (
                <ArtifactContributorsRemoveRole
                  suiObjectId={suiObjectId}
                  creator={meta.creator}
                />
              )}
            </Flex>
          );
        })}
      </Vstack>
    </Stack>
  );
};
