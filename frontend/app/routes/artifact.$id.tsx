import Artifact from "app/layout/Artifact";
import type { Route } from "./+types/artifact.$id";
import {
  useArtifactQuery,
  type ArtifactQuery,
  type ArtifactQueryVariables,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import type { MetaFunction } from "react-router";
import { getQueryClient } from "app/layout/Provider/ProviderReactQuery";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const keys: ArtifactQueryVariables = {
    suiObjectId: params.id,
  };

  return await getQueryClient.fetchQuery({
    queryKey: useArtifactQuery.getKey(keys),
    queryFn: useArtifactQuery.fetcher(graphqlApp.client, keys),
  });
}

// force the client loader to run during hydration
clientLoader.hydrate = true as const; // `as const` for type inference

export const meta: MetaFunction<Route.ClientLoaderArgs> = ({ loaderData }) => {
  const data = loaderData as ArtifactQuery;

  return [
    {
      title: data?.artifact?.title,
      description: data?.artifact?.description,
    },
  ];
};

export default (props: Route.ComponentProps) => {
  return <Artifact {...props} />;
};
