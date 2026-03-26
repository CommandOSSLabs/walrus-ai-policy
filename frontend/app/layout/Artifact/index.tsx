import Flex from "app/components/Flex";
import Vstack from "app/components/Vstack";
import ArtifactFiles from "./ArtifactFiles";
import ArtifactHeader from "./ArtifactHeader";
import type { Route } from "../../routes/+types/artifact.$id";
import { useArtifactQuery } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import ArtifactVersions from "./ArtifactVersions";
import ArtifactContributors from "./ArtifactContributors";
import ArtifactStatistic from "./ArtifactStatistic";

export default ({ loaderData, params }: Route.ComponentProps) => {
  const { data } = useArtifactQuery(
    graphqlApp.client,
    {
      suiObjectId: params.id,
    },
    {
      initialData: loaderData,
    },
  );

  if (!data?.artifact) return;

  return (
    <Flex className="gap-12 pt-8 pb-12 mx-auto max-w-5xl">
      <Vstack className="items-start flex-1 gap-8">
        <ArtifactHeader artifact={data.artifact} />

        <ArtifactFiles files={data.artifact.files} />
      </Vstack>

      <Vstack className="gap-6 w-70">
        <ArtifactStatistic />

        <ArtifactVersions />

        <ArtifactContributors />
      </Vstack>
    </Flex>
  );
};
