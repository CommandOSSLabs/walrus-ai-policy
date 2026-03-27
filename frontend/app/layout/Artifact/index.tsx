import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import ArtifactFiles from "./ArtifactFiles";
import ArtifactHeader from "./ArtifactHeader";
import type { Route } from "../../routes/+types/artifact.$id";
import ArtifactVersions from "./ArtifactVersions";
import ArtifactContributors from "./ArtifactContributors";
import ArtifactStatistic from "./ArtifactStatistic";
import ArtifactReadme from "./ArtifactReadme";
import { tv } from "tailwind-variants";

export default ({ loaderData }: Route.ComponentProps) => {
  const artifact = loaderData.artifact;

  if (!artifact) return null;

  return (
    <Flex
      //
      className={tv({
        base: [
          "flex-col md:flex-row",
          "gap-6 md:gap-12 pt-8 pb-12 px-4 2xl:px-0",
          "mx-auto max-w-5xl",
        ],
      })()}
    >
      <Vstack className="items-start flex-1 gap-4 md:gap-8">
        <ArtifactHeader artifact={artifact} />

        <ArtifactFiles files={artifact.files} />

        <ArtifactReadme />
      </Vstack>

      <Vstack className="gap-4 md:gap-6 md:w-70">
        <ArtifactStatistic artifact={artifact} />

        <ArtifactVersions
          suiObjectId={artifact.suiObjectId}
          rootId={artifact.rootId}
        />

        <ArtifactContributors
          suiObjectId={artifact.suiObjectId}
          rootId={artifact.rootId}
        />
      </Vstack>
    </Flex>
  );
};
