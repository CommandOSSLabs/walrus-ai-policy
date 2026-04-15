import Artifact from "app/layout/Artifact";
import type { Route } from "./+types/artifact.$id";
import {
  type ArtifactQuery,
  useArtifactQuery,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { getQueryClient } from "app/layout/Provider/ProviderReactQuery";
import SEO from "app/components/SEO";

export async function loader({ params }: Route.LoaderArgs) {
  return useArtifactQuery.fetcher(graphqlApp.client, {
    suiObjectId: params.id,
  })();
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const queryKey = useArtifactQuery.getKey({
    suiObjectId: params.id,
  });

  // get data from queryClient
  {
    const artifact = getQueryClient.getQueryData<ArtifactQuery>(queryKey);

    if (artifact) return artifact;
  }

  // query data because doesn't have cache
  const fetcher = await getQueryClient.fetchQuery({
    queryKey,
    queryFn: useArtifactQuery.fetcher(graphqlApp.client, {
      suiObjectId: params.id,
    }),
  });

  return fetcher;
}

export default (props: Route.ComponentProps) => {
  return (
    <>
      <SEO
        pageTitle={props.loaderData.artifact?.title ?? "Artifact"}
        description={props.loaderData.artifact?.description}
      />

      <Artifact {...props} />
    </>
  );
};
