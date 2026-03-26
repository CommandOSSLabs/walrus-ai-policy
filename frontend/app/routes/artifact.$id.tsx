import Artifact from "app/layout/Artifact";
import type { Route } from "./+types/artifact.$id";
import { useArtifactQuery } from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";

const fetchArtifact = (suiObjectId: string) => {
  return useArtifactQuery.fetcher(graphqlApp.client, {
    suiObjectId,
  })();
};

export async function loader({ params }: Route.LoaderArgs) {
  return fetchArtifact(params.id);
}

export async function clientLoader({
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  try {
    const serverData = await serverLoader();

    if (serverData?.artifact) {
      return serverData;
    }
  } catch {
    // Non-prerendered dynamic routes in SPA mode may not have server data.
  }

  return fetchArtifact(params.id);
}

export default (props: Route.ComponentProps) => {
  return <Artifact {...props} />;
};
