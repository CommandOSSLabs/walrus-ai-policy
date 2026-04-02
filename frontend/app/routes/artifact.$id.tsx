import Artifact from "app/layout/Artifact";
import type { Route } from "./+types/artifact.$id";
import {
  useArtifactQuery,
  type ArtifactQueryVariables,
} from "app/services/graphql-app/generated";
import graphqlApp from "app/services/graphql-app";
import { getQueryClient } from "app/layout/Provider/ProviderReactQuery";
import SEO from "app/components/SEO";
import utilsConstants from "app/utils/utils.constants";

const fetchArtifact = async (suiObjectId: string) => {
  const keys: ArtifactQueryVariables = {
    suiObjectId,
  };

  return await getQueryClient.fetchQuery({
    queryKey: useArtifactQuery.getKey(keys),
    queryFn: useArtifactQuery.fetcher(graphqlApp.client, keys),
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
        title={
          props.loaderData.artifact?.title ||
          `${utilsConstants.FORMAT_SEO.title} | Artifact Detail`
        }
        description={
          props.loaderData.artifact?.description ||
          utilsConstants.FORMAT_SEO.description
        }
      />

      <Artifact {...props} />
    </>
  );
};
