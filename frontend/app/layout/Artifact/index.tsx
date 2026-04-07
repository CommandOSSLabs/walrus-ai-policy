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
import { renderSectionFile } from "app/utils";
import ArtifactFileReadme from "./ArtifactFile/ArtifactFileReadme";
import ArtifactFilePreview from "./ArtifactFile/ArtifactFilePreview";

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

  const getSelectFile = searchParams?.get?.("file");

  const getSingleFile = artifact.data?.artifact?.files?.[0];

  const getREADME = artifact.data?.artifact?.files?.find?.(
    (file) => file.name === "README.md",
  );

  const isAdmin = !!artifact.data?.artifact?.contributors?.some((meta) => {
    return (
      meta?.creator === currentAccount?.address &&
      contributorConfig.data?.[meta.role] ===
        contributorConfigEnum[contributorConfigEnum.admin]
    );
  });

  const isContributors = !!artifact.data?.artifact?.contributors?.some(
    (meta) => meta?.creator === currentAccount?.address,
  );

  if (!artifact.data?.artifact) return null;

  if (searchParams?.get?.("release")?.length) {
    return (
      <ArtifactRelease
        artifact={artifact.data.artifact}
        isContributors={isContributors}
        onRefetch={artifact.refetch}
      />
    );
  }

  if (getSelectFile?.length) {
    return (
      <ArtifactFilePreview
        files={artifact.data.artifact.files}
        rootId={artifact.data.artifact?.rootId}
        suiObjectId={artifact.data.artifact.suiObjectId}
        select={getSelectFile}
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
      <Vstack className="flex-1 min-w-0 items-start gap-4 md:gap-8">
        <ArtifactHeader artifact={artifact.data.artifact} />

        {(function () {
          if (!artifact.data.artifact?.files?.length) return null;

          if (artifact.data.artifact.files.length === 1 && getSingleFile) {
            return renderSectionFile(getSingleFile.mimeType, {
              csv: <ArtifactFileCSV file={getSingleFile} />,
              svg: <ArtifactFileSVG file={getSingleFile} />,
              image: (
                <img
                  src={utilsWalrus.getQuiltPatchId(getSingleFile.patchId)}
                  alt={getSingleFile.name}
                  className="aspect-video object-cover"
                />
              ),
              video: (
                <video
                  src={utilsWalrus.getQuiltPatchId(getSingleFile.patchId)}
                  controls={true}
                  className="aspect-video object-cover"
                />
              ),
              markdown: getREADME ? (
                <ArtifactFileReadme file={getREADME} />
              ) : (
                <ArtifactFileMarkdown file={getSingleFile} />
              ),
              pdf: <ArtifactFilePDF file={getSingleFile} />,
            });
          }

          return (
            <>
              <ArtifactFileList
                files={artifact.data.artifact.files}
                rootId={artifact.data.artifact?.rootId}
                suiObjectId={artifact.data.artifact.suiObjectId}
                onRefetch={artifact.refetch}
              />

              {getREADME && <ArtifactFileReadme file={getREADME} />}
            </>
          );
        })()}
      </Vstack>

      <Vstack className="gap-4 md:gap-6 md:w-70 md:shrink-0">
        <ArtifactStatistic
          artifact={artifact.data.artifact}
          onRefetch={artifact.refetch}
        />

        <ArtifactVersions
          suiObjectId={artifact.data.artifact.suiObjectId}
          versions={artifact.data.artifact.versions}
          isAdmin={isAdmin}
          isLoading={contributorConfig.isLoading}
        />

        <ArtifactContributors
          contributors={artifact.data.artifact.contributors}
          rootId={
            artifact.data.artifact?.rootId || artifact.data.artifact.suiObjectId
          }
          isAdmin={isAdmin}
          onRefetch={artifact.refetch}
        />
      </Vstack>
    </Flex>
  );
};
