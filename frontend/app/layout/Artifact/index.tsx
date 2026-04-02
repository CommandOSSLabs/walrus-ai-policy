import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import ArtifactHeader from "./ArtifactHeader";
import type { Route } from "../../routes/+types/artifact.$id";
import ArtifactVersions from "./ArtifactVersions";
import ArtifactContributors from "./ArtifactContributors";
import ArtifactStatistic from "./ArtifactStatistic";
import { tv } from "tailwind-variants";
import { lazy } from "react";
import ArtifactFileList from "./ArtifactFile/ArtifactFileList";
import ArtifactFileMarkdown from "./ArtifactFile/ArtifactFileMarkdown";
import utilsWalrus from "app/utils/utils.walrus";
import ArtifactFileSVG from "./ArtifactFile/ArtifactFileSVG";
import ArtifactFilePDF from "./ArtifactFile/ArtifactFilePDF";
import { useArtifactQuery } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import useGetConfig, { contributorConfigEnum } from "app/hook/useGetConfig";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useSearchParams } from "react-router";
import ArtifactRelease from "./ArtifactRelease";

const ArtifactFileCSV = lazy(() => import("./ArtifactFile/ArtifactFileCSV"));

export default ({ loaderData, params }: Route.ComponentProps) => {
  const [searchParams] = useSearchParams();

  const currentAccount = useCurrentAccount();

  const { contributorConfig } = useGetConfig();

  const artifact = useArtifactQuery(
    graphqlApp.client,
    {
      suiObjectId: params.id,
    },
    {
      initialData: loaderData,
    },
  );

  const getSingleFile = artifact.data?.artifact?.files[0];

  const getREADME = artifact.data?.artifact?.files?.find?.(
    (file) => file.name === "README.md",
  );

  const isAdmin = !!artifact.data?.artifact?.contributors?.some(
    (meta) =>
      meta?.creator === currentAccount?.address &&
      contributorConfig.data?.[meta.role] === contributorConfigEnum.admin,
  );

  if (!artifact.data?.artifact) return null;

  if (searchParams?.get?.("release")?.length) {
    return (
      <ArtifactRelease
        artifact={artifact.data.artifact}
        isAdmin={isAdmin}
        isLoading={contributorConfig.isLoading}
        onRefetch={artifact.refetch}
      />
    );
  }

  return (
    <Flex
      className={tv({
        base: [
          "container",
          "flex-col md:flex-row",
          "gap-6 md:gap-12 pt-8 pb-12",
        ],
      })()}
    >
      <Vstack className="flex-1 items-start gap-4 md:gap-8">
        <ArtifactHeader artifact={artifact.data.artifact} />

        {(function () {
          if (!artifact.data.artifact?.files?.length) return null;

          if (artifact.data.artifact.files.length === 1) {
            if (getSingleFile?.mimeType === "text/csv") {
              return <ArtifactFileCSV file={getSingleFile} />;
            }

            if (getSingleFile?.mimeType === "image/svg+xml") {
              return <ArtifactFileSVG file={getSingleFile} />;
            }

            if (getSingleFile?.mimeType?.startsWith?.("image")) {
              return (
                <img
                  src={utilsWalrus.getQuiltPatchId(getSingleFile.patchId)}
                  alt={getSingleFile.name}
                  className="aspect-video object-cover"
                />
              );
            }

            if (getSingleFile?.mimeType?.startsWith?.("video")) {
              return (
                <video
                  src={utilsWalrus.getQuiltPatchId(getSingleFile.patchId)}
                  controls={true}
                  className="aspect-video object-cover"
                />
              );
            }

            if (getSingleFile?.mimeType === "text/markdown") {
              return <ArtifactFileMarkdown file={getSingleFile} />;
            }

            if (getSingleFile?.mimeType === "application/pdf") {
              return <ArtifactFilePDF file={getSingleFile} />;
            }
          }

          return (
            <>
              <ArtifactFileList
                files={artifact.data.artifact.files}
                rootId={artifact.data.artifact.rootId}
              />

              {getREADME && <ArtifactFileMarkdown file={getREADME} />}
            </>
          );
        })()}
      </Vstack>

      <Vstack className="gap-4 md:gap-6 md:w-70">
        <ArtifactStatistic artifact={artifact.data.artifact} />

        <ArtifactVersions
          suiObjectId={artifact.data.artifact.suiObjectId}
          versions={artifact.data.artifact.versions}
          isAdmin={isAdmin}
          isLoading={contributorConfig.isLoading}
        />

        <ArtifactContributors
          contributorConfig={contributorConfig}
          contributors={artifact.data.artifact.contributors}
          suiObjectId={artifact.data.artifact.suiObjectId}
          isAdmin={isAdmin}
        />
      </Vstack>
    </Flex>
  );
};
