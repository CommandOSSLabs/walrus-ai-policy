import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import ArtifactHeader from "./ArtifactHeader";
import type { Route } from "../../routes/+types/artifact.$id";
import ArtifactVersions from "./ArtifactVersions";
import ArtifactContributors from "./ArtifactContributors";
import ArtifactStatistic from "./ArtifactStatistic";
import { tv } from "tailwind-variants";
import ArtifactFileList from "./ArtifactFile/ArtifactFileList";

import { useArtifactQuery } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import useGetConfig, { contributorConfigEnum } from "app/hook/useGetConfig";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useSearchParams } from "react-router";
import ArtifactRelease from "./ArtifactRelease";
import ArtifactFileReadme from "./ArtifactFile/ArtifactFileReadme";
import ArtifactFilePreview from "./ArtifactFile/ArtifactFilePreview";
import ArtifactFileSection from "./ArtifactFile/ArtifactFileSection";

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

  if (!artifact.data?.artifact) return null;

  if (searchParams?.get?.("release")?.length) {
    return (
      <ArtifactRelease
        artifact={artifact.data.artifact}
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

          if (artifact.data.artifact.files.length === 1) {
            return (
              <ArtifactFileSection
                file={artifact.data.artifact.files[0]}
                rootId={
                  artifact.data.artifact?.rootId ||
                  artifact.data.artifact.suiObjectId
                }
                onRefetch={artifact.refetch}
              />
            );
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
