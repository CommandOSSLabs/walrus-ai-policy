import DownloadLine from "public/assets/line/download.svg";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import EyesLine from "public/assets/line/eyes.svg";

import type { ArtifactQuery } from "app/services/graphql-app/generated";
import { useIncrementViewMutation } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { formatCount, formatGrammarCount } from "app/utils";
import useMount from "app/hook/useMount";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import ArtifactStatisticDownload from "./ArtifactStatisticDownload";
import ArtifactStatisticShare from "./ArtifactStatisticShare";
import ArtifactStatisticSponsor from "./ArtifactStatisticSponsor";

interface ArtifactStatisticProps {
  artifact: NonNullable<ArtifactQuery["artifact"]>;
  onRefetch: () => void;
}

export default ({ artifact, onRefetch }: ArtifactStatisticProps) => {
  const currentAccount = useCurrentAccount();

  const incrementView = useIncrementViewMutation(graphqlApp.client);

  const rootId = artifact.rootId ?? artifact.suiObjectId;

  useMount(() => {
    incrementView.mutate(
      {
        rootId,
        viewerAddress: currentAccount!.address,
      },
      {
        onSuccess: onRefetch,
      },
    );
  }, [rootId, currentAccount?.address]);

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
        <ArtifactStatisticDownload
          artifact={artifact}
          rootId={rootId}
          onRefetch={onRefetch}
        />

        <ArtifactStatisticSponsor creator={artifact.creator} />

        <ArtifactStatisticShare artifact={artifact} />
      </Vstack>

      <Hstack className="gap-3 text-[#BACAC4] text-xs">
        <Hstack>
          <EyesLine />

          <Typography font="jetbrains">
            {formatGrammarCount(
              `${formatCount(artifact.stats.viewCount)} view`,
              artifact.stats.viewCount,
            )}
          </Typography>
        </Hstack>

        <Hstack>
          <DownloadLine />

          <Typography font="jetbrains">
            {formatGrammarCount(
              `${formatCount(artifact.stats.downloadCount)} download`,
              artifact.stats.downloadCount,
            )}
          </Typography>
        </Hstack>
      </Hstack>
    </Stack>
  );
};
