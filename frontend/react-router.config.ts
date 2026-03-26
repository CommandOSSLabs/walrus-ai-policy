import type { Config } from "@react-router/dev/config";
import graphqlApp from "app/services/graphql-app";
import { useArtifactsQuery } from "app/services/graphql-app/generated";

export default {
  ssr: true,

  prerender: {
    paths: async ({ getStaticPaths }) => {
      // get all routes static, not includes /:id
      const route_static = getStaticPaths();

      const { artifacts } = await useArtifactsQuery.fetcher(graphqlApp.client, {
        limit: 100,
        offset: 0,
      })();

      return [
        ...route_static,

        ...artifacts.items.map((meta) => `/artifact/${meta.suiObjectId}`),
      ];
    },

    unstable_concurrency: 4,
  },
} satisfies Config;
