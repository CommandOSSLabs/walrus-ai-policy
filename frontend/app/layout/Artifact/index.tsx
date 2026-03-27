import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import ArtifactHeader from "./ArtifactHeader";
import type { Route } from "../../routes/+types/artifact.$id";
import ArtifactVersions from "./ArtifactVersions";
import ArtifactContributors from "./ArtifactContributors";
import ArtifactStatistic from "./ArtifactStatistic";
import { tv } from "tailwind-variants";
import React, { lazy } from "react";
import ArtifactFileList from "./ArtifactFile/ArtifactFileList";
import ArtifactFileMarkdown from "./ArtifactFile/ArtifactFileMarkdown";
import utilsWalrus from "app/utils/utils.walrus";
import ArtifactFileSVG from "./ArtifactFile/ArtifactFileSVG";

const ArtifactFileCSV = lazy(() => import("./ArtifactFile/ArtifactFileCSV"));

export default ({ loaderData }: Route.ComponentProps) => {
  const artifact = loaderData.artifact;

  if (!artifact) return null;

  const getREADME = artifact.files.find((file) => file.name === "README.md");

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
        <ArtifactHeader artifact={artifact} />

        {(function () {
          if (artifact.files.length) {
            if (artifact.files[0].mimeType === "text/csv") {
              return <ArtifactFileCSV file={artifact.files[0]} />;
            }

            if (artifact.files[0].mimeType === "image/svg+xml") {
              return <ArtifactFileSVG file={artifact.files[0]} />;
            }

            if (artifact.files[0].mimeType.startsWith("image")) {
              return (
                <img
                  src={utilsWalrus.getQuiltPatchId(artifact.files[0].patchId)}
                  alt={artifact.files[0].name}
                  className="aspect-video object-cover"
                />
              );
            }

            if (artifact.files[0].mimeType.startsWith("video")) {
              return (
                <video
                  src={utilsWalrus.getQuiltPatchId(artifact.files[0].patchId)}
                  controls={true}
                  className="aspect-video object-cover"
                />
              );
            }

            if (artifact.files[0].mimeType === "text/markdown") {
              return <ArtifactFileMarkdown file={artifact.files[0]} />;
            }
          }

          return (
            <>
              <ArtifactFileList files={artifact.files} />

              {getREADME && <ArtifactFileMarkdown file={getREADME} />}
            </>
          );
        })()}
      </Vstack>

      <Vstack className="gap-4 md:gap-6 md:w-70">
        <ArtifactStatistic artifact={artifact} />

        <ArtifactVersions
          suiObjectId={artifact.suiObjectId}
          versions={artifact.versions}
        />

        <ArtifactContributors contributors={artifact.contributors} />
      </Vstack>
    </Flex>
  );
};
