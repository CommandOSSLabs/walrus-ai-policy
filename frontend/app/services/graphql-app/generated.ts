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
  createdAt: Scalars["Int"]["output"];
  creator: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  parentId?: Maybe<Scalars["String"]["output"]>;
  rootId?: Maybe<Scalars["String"]["output"]>;
  suiObjectId: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type ArtifactConnection = {
  items: Array<Artifact>;
  totalCount: Scalars["Int"]["output"];
};

export type ArtifactDetail = {
  category: Scalars["String"]["output"];
  createdAt: Scalars["Int"]["output"];
  creator: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  files: Array<ArtifactFile>;
  parentId?: Maybe<Scalars["String"]["output"]>;
  rootId?: Maybe<Scalars["String"]["output"]>;
  suiObjectId: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type ArtifactFile = {
  mimeType: Scalars["String"]["output"];
  patchId: Scalars["String"]["output"];
  sizeBytes: Scalars["Int"]["output"];
};

export type ArtifactFilter = {
  category?: InputMaybe<Scalars["String"]["input"]>;
  creator?: InputMaybe<Scalars["String"]["input"]>;
  onlyRoots?: InputMaybe<Scalars["Boolean"]["input"]>;
  rootId?: InputMaybe<Scalars["String"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryRoot = {
  artifact?: Maybe<ArtifactDetail>;
  artifactVersions: Array<Artifact>;
  artifacts: ArtifactConnection;
};

export type QueryRootArtifactArgs = {
  suiObjectId: Scalars["String"]["input"];
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

export type ArtifactQueryVariables = Exact<{
  suiObjectId: Scalars["String"]["input"];
}>;

export type ArtifactQuery = {
  artifact?: {
    suiObjectId: string;
    title: string;
    description: string;
    creator: string;
    createdAt: number;
    category: string;
    version: number;
    files: Array<{ patchId: string; mimeType: string; sizeBytes: number }>;
  };
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

export const ArtifactDocument = `
    query Artifact($suiObjectId: String!) {
  artifact(suiObjectId: $suiObjectId) {
    suiObjectId
    title
    description
    creator
    createdAt
    category
    version
    files {
      patchId
      mimeType
      sizeBytes
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
