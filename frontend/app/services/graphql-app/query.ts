/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from "graphql-request";

// home page
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

const platformStats = gql`
  query PlatformStats {
    platformStats {
      totalSizeBytes
    }
  }
`;

// artifact detail
const artifact = gql`
  query Artifact($suiObjectId: String!) {
    artifact(suiObjectId: $suiObjectId) {
      suiObjectId
      rootId
      title
      description
      creator
      createdAt
      category
      version

      versions {
        suiObjectId
        version
        createdAt
        creator
      }

      contributors {
        creator
        role
      }

      files {
        patchId
        mimeType
        sizeBytes
        name
      }
    }
  }
`;
