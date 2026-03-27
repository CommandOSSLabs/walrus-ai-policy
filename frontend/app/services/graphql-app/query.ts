/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from "graphql-request";

const artifacts = gql`
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

const artifact = gql`
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
        name
      }
    }
  }
`;

const platformStats = gql`
  query PlatformStats {
    platformStats {
      totalSizeBytes
    }
  }
`;
