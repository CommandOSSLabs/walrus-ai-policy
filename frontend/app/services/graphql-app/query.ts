/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from "graphql-request";

// home page
const artifacts = gql`
  query Artifacts($filter: ArtifactFilter, $limit: Int!, $offset: Int!, $sort: SortField!) {
    artifacts(filter: $filter, limit: $limit, offset: $offset, sort: $sort) {
      totalCount

      items {
        suiObjectId
        title
        description
        creator
        createdAt
        category
        version

        stats {
          viewCount
          downloadCount
        }
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

      stats {
        viewCount
        downloadCount
      }

      versions {
        suiObjectId
        version
        createdAt
        creator
      }
    }
  }
`;

const incrementView = gql`
  mutation IncrementView($rootId: String!, $viewerAddress: String!) {
    incrementView(rootId: $rootId, viewerAddress: $viewerAddress)
  }
`;

const incrementDownload = gql`
  mutation IncrementDownload($rootId: String!) {
    incrementDownload(rootId: $rootId)
  }
`;
