import type { Config } from "@react-router/dev/config";
import graphqlApp from "app/services/graphql-app";
import { useArtifactsQuery } from "app/services/graphql-app/generated";

export default {
  ssr: false,
  prerender: async ({ getStaticPaths }) => {
    const staticPaths = getStaticPaths();

    const fetcherArtifacts = await new Promise<string[]>(async (resolve) => {
      try {
        const { artifacts } = await useArtifactsQuery.fetcher(
          graphqlApp.client,
          {
            limit: 1000,
            offset: 0,
            filter: {
              onlyRoots: true,
            },
          },
        )();

        resolve(
          artifacts.items.map(({ suiObjectId }) => `/artifact/${suiObjectId}`),
        );
      } catch {
        resolve([]);
      }
    });

    return [...staticPaths, ...fetcherArtifacts];
  },
} satisfies Config;
