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
