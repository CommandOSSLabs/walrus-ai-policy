import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import ArtifactFiles from "./ArtifactFiles";
import ArtifactHeader from "./ArtifactHeader";
import type { Route } from "../../routes/+types/artifact.$id";
import ArtifactVersions from "./ArtifactVersions";
import ArtifactContributors from "./ArtifactContributors";
import ArtifactStatistic from "./ArtifactStatistic";
import ArtifactReadme from "./ArtifactReadme";

export default ({ loaderData }: Route.ComponentProps) => {
  const artifact = loaderData.artifact;

  if (!artifact) return null;

  return (
    <Flex className="gap-12 pt-8 pb-12 mx-auto max-w-5xl">
      <Vstack className="items-start flex-1 gap-8">
        <ArtifactHeader artifact={artifact} />

        <ArtifactFiles files={artifact.files} />

        <ArtifactReadme />
      </Vstack>

      <Vstack className="gap-6 w-70">
        <ArtifactStatistic />

        <ArtifactVersions />

        <ArtifactContributors />
      </Vstack>
    </Flex>
  );
};
