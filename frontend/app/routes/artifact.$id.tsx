import Artifact from "app/layout/Artifact";
import type { Route } from "./+types/artifact.$id";
import {
  useArtifactQuery,
  type ArtifactQuery,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import type { MetaFunction } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return await useArtifactQuery.fetcher(graphqlApp.client, {
    suiObjectId: params.id,
  })();
}

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
