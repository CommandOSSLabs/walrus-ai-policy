import Artifact from "app/layout/Artifact";
import type { Route } from "./+types/artifact.$id";
import {
  useArtifactQuery,
  type ArtifactQueryVariables,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { getQueryClient } from "app/layout/Provider/ProviderReactQuery";
import SEO from "app/components/SEO";

const fetchArtifact = async (suiObjectId: string) => {
  const keys: ArtifactQueryVariables = { suiObjectId };
  return getQueryClient.fetchQuery({
    queryKey: useArtifactQuery.getKey(keys),
    queryFn: useArtifactQuery.fetcher(graphqlApp.client, keys),
    staleTime: 1000,
  });
};

export async function loader({ params }: Route.LoaderArgs) {
  return fetchArtifact(params.id);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return fetchArtifact(params.id);
}

// force the client loader to run during hydration
clientLoader.hydrate = true as const; // `as const` for type inference

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
