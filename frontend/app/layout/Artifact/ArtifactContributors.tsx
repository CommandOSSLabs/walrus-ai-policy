import Flex from "app/components/Flex";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import Center from "app/components/Center";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import Jazzicon from "app/components/Jazzicon";
import useGetConfig from "app/hook/useGetConfig";
import { useArtifactContributorsQuery } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { Skeleton } from "app/components/ui/skeleton";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { shorten } from "app/utils";

interface ArtifactContributorsProps {
  suiObjectId: string;
  rootId: string | undefined;
}

export default ({ suiObjectId, rootId }: ArtifactContributorsProps) => {
  const currentAccount = useCurrentAccount();

  const { contributorConfig } = useGetConfig();

  const { data, isLoading } = useArtifactContributorsQuery(graphqlApp.client, {
    rootId: rootId || suiObjectId,
  });

  if (isLoading) return <Skeleton className="min-h-68.5" />;

  if (!data?.artifactContributors?.length) return null;

  const isAdmin = data.artifactContributors.some(
    (meta) => meta === currentAccount?.address,
  );

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

      <Vstack className="w-full gap-3">
        {data.artifactContributors.map((meta, index) => {
          return (
            <Flex
              key={meta}
              className="bg-[#191F2D] border border-[#3B4A45] rounded-lg px-3 py-2 gap-3"
            >
              <Jazzicon address={meta} className="size-9" />

              <Vstack className="gap-0.5">
                <Typography
                  font="grotesk"
                  className="text-[#DDE2F5] text-xs font-bold"
                >
                  {shorten(meta)}
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
