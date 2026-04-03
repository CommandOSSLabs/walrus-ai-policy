import JSZip from "jszip";
import DownloadLine from "public/assets/line/download.svg";
import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import Vstack from "app/components/Vstack";
import { tv } from "tailwind-variants";
import Stack from "app/components/Stack";
import EyesLine from "public/assets/line/eyes.svg";
import HeartLine from "public/assets/line/heart.svg";
import ShareLine from "public/assets/line/share.svg";
import type { ArtifactQuery } from "app/services/graphql-app/generated";
import {
  useIncrementViewMutation,
  useIncrementDownloadMutation,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import utilsWalrus from "app/utils/utils.walrus";
import {
  downloadFileWithBlob,
  formatCount,
  formatGrammarCount,
} from "app/utils";
import { useState } from "react";
import useMount from "app/hook/useMount";
import Spinner from "app/components/Spinner";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

interface ArtifactStatisticProps {
  artifact: NonNullable<ArtifactQuery["artifact"]>;
  onRefetch: () => void;
}

export default ({ artifact, onRefetch }: ArtifactStatisticProps) => {
  const [loading, setLoading] = useState<string>();
  const currentAccount = useCurrentAccount();

  const incrementView = useIncrementViewMutation(graphqlApp.client);
  const incrementDownload = useIncrementDownloadMutation(graphqlApp.client);

  const effectiveRootId = artifact.rootId ?? artifact.suiObjectId;

  useMount(() => {
    incrementView.mutate(
      {
        rootId: effectiveRootId,
        viewerAddress: currentAccount!.address,
      },
      {
        onSuccess: onRefetch,
      },
    );
  }, [effectiveRootId, currentAccount?.address]);

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
        <button
          className="text-[#00382E] rounded-lg h-10 flex gap-2 items-center justify-center"
          disabled={!!loading?.length}
          style={{
            background: "linear-gradient(135deg, #46F1CF 0%, #00D4B4 100%)",
          }}
          onClick={async () => {
            try {
              setLoading("download");

              const zip = new JSZip();

              await Promise.all(
                artifact.files.map(async (meta) => {
                  const request = await fetch(
                    utilsWalrus.getQuiltPatchId(meta.patchId),
                  );

                  if (!request.ok) {
                    throw new Error(`Download failed for ${meta.name}`);
                  }

                  const blob = await request.blob();

                  zip.file(meta.name, blob);
                }),
              );

              const zipBlob = await zip.generateAsync({
                type: "blob",
              });

              downloadFileWithBlob(
                zipBlob,
                "application/zip",
                `artifact-${artifact.createdAt}`,
              );

              incrementDownload.mutate(
                {
                  rootId: effectiveRootId,
                },
                {
                  onSuccess: onRefetch,
                },
              );
            } finally {
              setLoading(undefined);
            }
          }}
        >
          {loading?.length ? <Spinner /> : <DownloadLine />}

          <Typography font="grotesk">DOWNLOAD ARTIFACT</Typography>
        </button>

        <button className="text-[#BACAC4] flex items-center justify-center gap-2 border border-[#3B4A45] h-10 rounded-lg">
          <HeartLine />

          <Typography font="grotesk">SPONSOR</Typography>
        </button>

        <button className="text-[#BACAC4] flex items-center justify-center gap-2 border border-[#3B4A45] h-10 rounded-lg">
          <ShareLine />

          <Typography font="grotesk">SHARE</Typography>
        </button>
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
