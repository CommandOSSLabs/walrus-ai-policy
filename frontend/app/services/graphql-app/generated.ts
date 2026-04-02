// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { GraphQLClient } from "graphql-request";
import type { RequestInit } from "graphql-request/dist/types.dom";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit["headers"],
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Artifact = {
  category: Scalars["String"]["output"];
  contributors: Array<Contributor>;
  createdAt: Scalars["Int"]["output"];
  creator: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  parentId?: Maybe<Scalars["String"]["output"]>;
  rootId?: Maybe<Scalars["String"]["output"]>;
  stats: ArtifactStats;
  suiObjectId: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  totalSizeBytes: Scalars["Int"]["output"];
  version: Scalars["Int"]["output"];
  versions: Array<Artifact>;
};

export type ArtifactConnection = {
  items: Array<Artifact>;
  totalCount: Scalars["Int"]["output"];
};

export type ArtifactDetail = {
  category: Scalars["String"]["output"];
  contributors: Array<Contributor>;
  createdAt: Scalars["Int"]["output"];
  creator: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  files: Array<ArtifactFile>;
  parentId?: Maybe<Scalars["String"]["output"]>;
  rootId?: Maybe<Scalars["String"]["output"]>;
  stats: ArtifactStats;
  suiObjectId: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  totalSizeBytes: Scalars["Int"]["output"];
  version: Scalars["Int"]["output"];
  versions: Array<Artifact>;
};

export type ArtifactFile = {
  hash: Scalars["String"]["output"];
  mimeType: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  patchId: Scalars["String"]["output"];
  sizeBytes: Scalars["Int"]["output"];
};

export type ArtifactFilter = {
  category?: InputMaybe<Array<Scalars["String"]["input"]>>;
  creator?: InputMaybe<Scalars["String"]["input"]>;
  onlyRoots?: InputMaybe<Scalars["Boolean"]["input"]>;
  rootId?: InputMaybe<Scalars["String"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type ArtifactStats = {
  downloadCount: Scalars["Int"]["output"];
  viewCount: Scalars["Int"]["output"];
};

export type Contributor = {
  creator: Scalars["String"]["output"];
  role: Scalars["Int"]["output"];
};

export type MutationRoot = {
  incrementDownload: Scalars["Boolean"]["output"];
  incrementView: Scalars["Boolean"]["output"];
};

export type MutationRootIncrementDownloadArgs = {
  rootId: Scalars["String"]["input"];
};

export type MutationRootIncrementViewArgs = {
  rootId: Scalars["String"]["input"];
  viewerAddress: Scalars["String"]["input"];
};

export type PlatformStats = {
  totalSizeBytes: Scalars["Int"]["output"];
};

export type QueryRoot = {
  artifact?: Maybe<ArtifactDetail>;
  artifactContributors: Array<Contributor>;
  artifactVersions: Array<Artifact>;
  artifacts: ArtifactConnection;
  platformStats: PlatformStats;
};

export type QueryRootArtifactArgs = {
  suiObjectId: Scalars["String"]["input"];
};

export type QueryRootArtifactContributorsArgs = {
  rootId: Scalars["String"]["input"];
};

export type QueryRootArtifactVersionsArgs = {
  rootId: Scalars["String"]["input"];
};

export type QueryRootArtifactsArgs = {
  filter?: InputMaybe<ArtifactFilter>;
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  sort?: SortField;
};

export enum SortField {
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  DownloadCountDesc = "DOWNLOAD_COUNT_DESC",
  ViewCountDesc = "VIEW_COUNT_DESC",
}

export type ArtifactsQueryVariables = Exact<{
  filter?: InputMaybe<ArtifactFilter>;
  limit: Scalars["Int"]["input"];
  offset: Scalars["Int"]["input"];
}>;

export type ArtifactsQuery = {
  artifacts: {
    totalCount: number;
    items: Array<{
      suiObjectId: string;
      title: string;
      description: string;
      creator: string;
      createdAt: number;
      category: string;
      version: number;
    }>;
  };
};

export type PlatformStatsQueryVariables = Exact<{ [key: string]: never }>;

export type PlatformStatsQuery = { platformStats: { totalSizeBytes: number } };

export type ArtifactQueryVariables = Exact<{
  suiObjectId: Scalars["String"]["input"];
}>;

export type ArtifactQuery = {
  artifact?: {
    suiObjectId: string;
    rootId?: string;
    parentId?: string;
    title: string;
    description: string;
    creator: string;
    createdAt: number;
    category: string;
    version: number;
    contributors: Array<{ creator: string; role: number }>;
    files: Array<{
      patchId: string;
      mimeType: string;
      sizeBytes: number;
      name: string;
      hash: string;
    }>;
  };
};

export type ArtifactVersionsQueryVariables = Exact<{
  rootId: Scalars["String"]["input"];
}>;

export type ArtifactVersionsQuery = {
  artifactVersions: Array<{
    suiObjectId: string;
    version: number;
    createdAt: number;
    creator: string;
  }>;
};

export const ArtifactsDocument = `
    query Artifacts($filter: ArtifactFilter, $limit: Int!, $offset: Int!) {
  artifacts(filter: $filter, limit: $limit, offset: $offset) {
    totalCount
    items {
      suiObjectId
      title
      description
      creator
      createdAt
      category
      version
    }
  }
}
    `;

export const useArtifactsQuery = <TData = ArtifactsQuery, TError = unknown>(
  client: GraphQLClient,
  variables: ArtifactsQueryVariables,
  options?: Omit<UseQueryOptions<ArtifactsQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<ArtifactsQuery, TError, TData>["queryKey"];
  },
  headers?: RequestInit["headers"],
) => {
  return useQuery<ArtifactsQuery, TError, TData>({
    queryKey: ["Artifacts", variables],
    queryFn: fetcher<ArtifactsQuery, ArtifactsQueryVariables>(
      client,
      ArtifactsDocument,
      variables,
      headers,
    ),
    ...options,
  });
};

useArtifactsQuery.getKey = (variables: ArtifactsQueryVariables) => [
  "Artifacts",
  variables,
];

useArtifactsQuery.fetcher = (
  client: GraphQLClient,
  variables: ArtifactsQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<ArtifactsQuery, ArtifactsQueryVariables>(
    client,
    ArtifactsDocument,
    variables,
    headers,
  );

export const PlatformStatsDocument = `
    query PlatformStats {
  platformStats {
    totalSizeBytes
  }
}
    `;

export const usePlatformStatsQuery = <
  TData = PlatformStatsQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables?: PlatformStatsQueryVariables,
  options?: Omit<
    UseQueryOptions<PlatformStatsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<PlatformStatsQuery, TError, TData>["queryKey"];
  },
  headers?: RequestInit["headers"],
) => {
  return useQuery<PlatformStatsQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ["PlatformStats"]
        : ["PlatformStats", variables],
    queryFn: fetcher<PlatformStatsQuery, PlatformStatsQueryVariables>(
      client,
      PlatformStatsDocument,
      variables,
      headers,
    ),
    ...options,
  });
};

usePlatformStatsQuery.getKey = (variables?: PlatformStatsQueryVariables) =>
  variables === undefined ? ["PlatformStats"] : ["PlatformStats", variables];

usePlatformStatsQuery.fetcher = (
  client: GraphQLClient,
  variables?: PlatformStatsQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<PlatformStatsQuery, PlatformStatsQueryVariables>(
    client,
    PlatformStatsDocument,
    variables,
    headers,
  );

export const ArtifactDocument = `
    query Artifact($suiObjectId: String!) {
  artifact(suiObjectId: $suiObjectId) {
    suiObjectId
    rootId
    parentId
    title
    description
    creator
    createdAt
    category
    version
    contributors {
      creator
      role
    }
    files {
      patchId
      mimeType
      sizeBytes
      name
      hash
    }
  }
}
    `;

export const useArtifactQuery = <TData = ArtifactQuery, TError = unknown>(
  client: GraphQLClient,
  variables: ArtifactQueryVariables,
  options?: Omit<UseQueryOptions<ArtifactQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<ArtifactQuery, TError, TData>["queryKey"];
  },
  headers?: RequestInit["headers"],
) => {
  return useQuery<ArtifactQuery, TError, TData>({
    queryKey: ["Artifact", variables],
    queryFn: fetcher<ArtifactQuery, ArtifactQueryVariables>(
      client,
      ArtifactDocument,
      variables,
      headers,
    ),
    ...options,
  });
};

useArtifactQuery.getKey = (variables: ArtifactQueryVariables) => [
  "Artifact",
  variables,
];

useArtifactQuery.fetcher = (
  client: GraphQLClient,
  variables: ArtifactQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<ArtifactQuery, ArtifactQueryVariables>(
    client,
    ArtifactDocument,
    variables,
    headers,
  );

export const ArtifactVersionsDocument = `
    query ArtifactVersions($rootId: String!) {
  artifactVersions(rootId: $rootId) {
    suiObjectId
    version
    createdAt
    creator
  }
}
    `;

export const useArtifactVersionsQuery = <
  TData = ArtifactVersionsQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: ArtifactVersionsQueryVariables,
  options?: Omit<
    UseQueryOptions<ArtifactVersionsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      ArtifactVersionsQuery,
      TError,
      TData
    >["queryKey"];
  },
  headers?: RequestInit["headers"],
) => {
  return useQuery<ArtifactVersionsQuery, TError, TData>({
    queryKey: ["ArtifactVersions", variables],
    queryFn: fetcher<ArtifactVersionsQuery, ArtifactVersionsQueryVariables>(
      client,
      ArtifactVersionsDocument,
      variables,
      headers,
    ),
    ...options,
  });
};

useArtifactVersionsQuery.getKey = (
  variables: ArtifactVersionsQueryVariables,
) => ["ArtifactVersions", variables];

useArtifactVersionsQuery.fetcher = (
  client: GraphQLClient,
  variables: ArtifactVersionsQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<ArtifactVersionsQuery, ArtifactVersionsQueryVariables>(
    client,
    ArtifactVersionsDocument,
    variables,
    headers,
  );
